package sim

import (
	"fmt"
	"strings"
)

// Arena is a graph, a set of nodes and edges.
type Arena struct {
	Width  uint64
	Height uint64

	Nodes []*Node
	Edges []*Edge
}

// A Node is a location in the arena.
type Node struct {
	ID uint64
	X  uint64
	Y  uint64

	// Edges from this node.
	Edges []*Edge

	// Set of agents in this node.
	Agents map[*Agent]bool
}

// String returns a string representation of this node.
func (n *Node) String() string {
	return fmt.Sprintf("N%d (%d, %d)", n.ID, n.X, n.Y)
}

// Enter adds an agent to this node.
func (n *Node) Enter(agent *Agent) {
	n.Agents[agent] = true
	agent.Location = n
}

// Leave removes an agent from this node.
func (n *Node) Leave(a *Agent) {
	delete(n.Agents, a)
}

// Log logs data for one timestep in the simulation.
func (n *Node) Log(p *Provider, row *NodeDataRow) {
	row.ID = n.ID
	row.X = n.X
	row.Y = n.Y

	row.NAgents = uint64(len(n.Agents))
}

// An Edge is a bi-directional link between two Nodes in the arena.
type Edge struct {
	A *Node
	B *Node

	Weight uint64
}

// Follow moves an agent across an edge, returning the destination node.
func (e *Edge) Follow(agent *Agent) *Node {
	if e.A.Agents[agent] {
		e.A.Leave(agent)
		e.B.Enter(agent)
		return e.B
	}

	if e.B.Agents[agent] {
		e.B.Leave(agent)
		e.A.Enter(agent)
		return e.A
	}

	panic("tried to move agent through non-adjacent edge")
}

// Link creates an edge between two nodes.
func Link(a, b *Node) *Edge {
	edge := &Edge{A: a, B: b}

	a.Edges = append(a.Edges, edge)
	b.Edges = append(b.Edges, edge)

	return edge
}

// ToDot returns a Graphviz DOT file representing the graph.
func (a *Arena) ToDot() string {
	var builder strings.Builder

	builder.WriteString("graph {\n")

	for _, node := range a.Nodes {
		builder.WriteString(fmt.Sprintf("  N%d [pos=\"%d,-%d!\" shape=\"circle\"];\n",
			node.ID, node.X, node.Y))
	}

	builder.WriteString("\n")

	for _, edge := range a.Edges {
		builder.WriteString(fmt.Sprintf("  N%d -- N%d [weight=%d label=\"%d\"];\n",
			edge.A.ID, edge.B.ID, edge.Weight, edge.Weight))
	}

	builder.WriteString("}\n")

	return builder.String()
}
