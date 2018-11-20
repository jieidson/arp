package sim

import (
	"fmt"
	"strings"
)

// Arena is a graph, a set of nodes and edges.
type Arena struct {
	Width  uint
	Height uint

	Nodes []*Node
	Edges []*Edge
}

// A Node is a location in the arena.
type Node struct {
	ID uint
	X  uint
	Y  uint

	edges []*Edge
}

// An Edge is a bi-directional link between two Nodes in the arena.
type Edge struct {
	A *Node
	B *Node

	Weight uint
}

// Link creates an edge between two nodes.
func Link(a, b *Node) *Edge {
	edge := &Edge{A: a, B: b}

	a.edges = append(a.edges, edge)
	b.edges = append(b.edges, edge)

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
