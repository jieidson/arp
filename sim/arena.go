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
}

// A Node is a location in the arena.
type Node struct {
	ID uint64
	X  uint64
	Y  uint64

	// Edges from this node.
	Edges []*Edge

	// List of agents in this node.
	Agents list.List
}

// String returns a string representation of this node.
func (n *Node) String() string {
	return fmt.Sprintf("N%d (%d, %d)", n.ID, n.X, n.Y)
}

// Log logs data for one timestep in the simulation.
func (n *Node) Log(p *Provider, row *NodeDataRow) {
	row.ID = n.ID
	row.X = n.X
	row.Y = n.Y

	row.NAgents = uint64(n.Agents.Len())
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
