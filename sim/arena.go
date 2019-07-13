package sim

import (
	"container/list"
	"fmt"
	"strings"
)

// Arena is a graph, a set of nodes and edges.
type Arena struct {
	Width  uint64
	Height uint64

	Nodes []*Node
	Edges []*Edge

	// Categories of nodes for easy access.
	MajorMajorLow  []*Node
	MajorMajorHigh []*Node
	MajorMinorLow  []*Node
	MajorMinorHigh []*Node
	MinorMinorLow  []*Node
	MinorMinorHigh []*Node
}

// Index returns the node index for a coordinate in the arena.
func (a *Arena) Index(x, y uint64) uint64 {
	return y*a.Width + x
}

// Node returns a node by coordinate in the arena.
func (a *Arena) Node(x, y uint64) *Node {
	return a.Nodes[a.Index(x, y)]
}

func (a *Arena) sortNodes() {
	// Sort the nodes into categories for easy access
	for _, node := range a.Nodes {
		switch node.Morals {
		case HighMoralContext:
			switch node.Intersection {
			case MajorMajorIntersection:
				a.MajorMajorHigh = append(a.MajorMajorHigh, node)

			case MajorMinorIntersection:
				a.MajorMinorHigh = append(a.MajorMinorHigh, node)

			case MinorMinorIntersection:
				a.MinorMinorHigh = append(a.MinorMinorHigh, node)
			}

		case LowMoralContext:
			switch node.Intersection {
			case MajorMajorIntersection:
				a.MajorMajorLow = append(a.MajorMajorLow, node)

			case MajorMinorIntersection:
				a.MajorMinorLow = append(a.MajorMinorLow, node)

			case MinorMinorIntersection:
				a.MinorMinorLow = append(a.MinorMinorLow, node)
			}
		}
	}
}

// MoralContext represents the morals of a node.
type MoralContext int

// The possible values for MoralContext.
const (
	HighMoralContext MoralContext = iota
	LowMoralContext
)

// IntersectionKind represents whether a node is the intersection of a
// major/major, major/minor, or minor/minor intersection.
type IntersectionKind int

// The possible values for IntersectionKind.
const (
	MinorMinorIntersection IntersectionKind = iota
	MajorMinorIntersection
	MajorMajorIntersection
)

// A Node is a location in the arena.
type Node struct {
	ID uint64
	X  uint64
	Y  uint64

	// Edges from this node.
	Edges []*Edge

	// List of agents in this node.
	Agents list.List

	Intersection IntersectionKind
	Morals       MoralContext

	// Aggregate data to track until the end of the simulation

	JobSiteCount uint64

	TotalConvergences  uint64
	TotalOpportunities uint64
	TotalRobberies     uint64
	TotalPolice        uint64
	TotalLCP           uint64
	TotalHCP           uint64
}

// String returns a string representation of this node.
func (n *Node) String() string {
	return fmt.Sprintf("N%d (%d, %d)", n.ID, n.X, n.Y)
}

// Walk calls fn for each node in distance steps from this node, including this
// node.
func (n *Node) Walk(distance int, fn func(*Node)) {
	visited := make(map[*Node]bool)
	walkRecurse(n, distance, fn, visited)
}

func walkRecurse(n *Node, distance int, fn func(*Node), visited map[*Node]bool) {
	if visited[n] {
		return
	}

	fn(n)
	visited[n] = true

	if distance > 0 {
		for _, edge := range n.Edges {
			if n == edge.B {
				edge.A.Walk(distance-1, fn)
			} else {
				edge.B.Walk(distance-1, fn)
			}
		}
	}
}

// Enter adds the agent to this node.
func (n *Node) Enter(agent *Agent) {
	agent.locationElement = n.Agents.PushBack(agent)
	agent.Location = n
}

// Leave removes the agent from this node.
func (n *Node) Leave(agent *Agent) {
	n.Agents.Remove(agent.locationElement)
	agent.Location = nil
}

// Log logs data for one timestep in the simulation.
func (n *Node) Log(p *Provider, row *NodeDataRow) {
	row.ID = n.ID
	row.X = n.X
	row.Y = n.Y

	row.MoralContext = int(n.Morals)
	row.Kind = int(n.Intersection)

	row.AgentCount = uint64(n.Agents.Len())
	row.JobSiteCount = n.JobSiteCount

	for el := n.Agents.Front(); el != nil; el = el.Next() {
		agent := el.Value.(*Agent)

		if _, ok := agent.Police(); ok {
			row.PoliceCount++
		}

		if offender, ok := agent.Offender(); ok {
			row.HCPCount++
			if offender.State == RobbedOffenderState {
				row.Robbery = true
			}
		} else {
			row.LCPCount++
		}

		if civilian, ok := agent.Civilian(); ok && civilian.IsActive {
			row.AtRiskCount++
		}
	}

	if row.PoliceCount == 0 && (row.AtRiskCount >= 2) {
		n.TotalConvergences++

		if row.HCPCount > 0 && !row.Robbery {
			n.TotalOpportunities++
		}
	}
}

// AggregateLog logs data at the end of the simulation.
func (n *Node) AggregateLog(p *Provider, row *AggregateNodeDataRow) {
	row.ID = n.ID
	row.X = n.X
	row.Y = n.Y

	row.MoralContext = int(n.Morals)
	row.Kind = int(n.Intersection)

	row.TotalConvergences = n.TotalConvergences
	row.TotalOpportunities = n.TotalOpportunities
	row.TotalRobberies = n.TotalRobberies
	row.TotalPolice = n.TotalPolice
	row.TotalLCP = n.TotalLCP
	row.TotalHCP = n.TotalHCP
}

// An Edge is a bi-directional link between two Nodes in the arena.
type Edge struct {
	A *Node
	B *Node

	Weight uint64
}

// Link creates an edge between two nodes.
func Link(a, b *Node) *Edge {
	edge := &Edge{A: a, B: b}

	a.Edges = append(a.Edges, edge)
	b.Edges = append(b.Edges, edge)

	return edge
}

// Follow moves an agent from one node to another along an edge.
func (edge *Edge) Follow(agent *Agent) *Node {
	if agent.Location == edge.A {
		edge.A.Leave(agent)
		edge.B.Enter(agent)
		return edge.B
	}

	if agent.Location == edge.B {
		edge.B.Leave(agent)
		edge.A.Enter(agent)
		return edge.A
	}

	panic("tried to move agent through non-adjacent edge")
}

// ToDot returns a Graphviz DOT file representing the graph.
func (a *Arena) ToDot() string {
	var builder strings.Builder

	builder.WriteString("graph {\n")

	for _, node := range a.Nodes {
		style := "solid"
		switch node.Intersection {
		case MajorMajorIntersection:
			style = "bold"

		case MajorMinorIntersection:
			style = "solid"

		case MinorMinorIntersection:
			style = "dashed"
		}

		shape := "circle"
		switch node.Morals {
		case HighMoralContext:
			shape = "circle"

		case LowMoralContext:
			shape = "box"
		}

		builder.WriteString(fmt.Sprintf("  N%d [pos=\"%d,-%d!\" shape=\"%s\" style=\"%s\"];\n",
			node.ID, node.X, node.Y, shape, style))
	}

	builder.WriteString("\n")

	for _, edge := range a.Edges {
		builder.WriteString(fmt.Sprintf("  N%d -- N%d [weight=%d label=\"%d\"];\n",
			edge.A.ID, edge.B.ID, edge.Weight, edge.Weight))
	}

	builder.WriteString("}\n")

	return builder.String()
}
