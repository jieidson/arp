package sim

import (
	"math"
)

// Navigator determines the shortest path between two nodes in an arena.
type Navigator struct {
	arena *Arena

	// Distance matrix.
	Dist [][]uint64

	// Table for next node ID in path between two nodes.
	Next [][]uint64
}

// NewNavigator creates a new Navigator from an Arena.
func NewNavigator(arena *Arena) *Navigator {
	// All-pairs shortest path algorithm
	// https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
	// Based on: https://github.com/cytoscape/cytoscape.js/blob/master/src/collection/algorithms/floyd-warshall.js

	// Distance matrix
	dist := initDistanceMatrix(arena.Nodes)

	// Table for next node in path between two nodes.
	next := emptyMatrix(len(arena.Nodes))

	// Record the distance between each pair of nodes that have an edge between
	// them.
	for _, edge := range arena.Edges {
		aID := uint64(edge.A.ID)
		bID := uint64(edge.B.ID)

		if dist[aID][bID] > edge.Weight {
			dist[aID][bID] = edge.Weight
			next[aID][bID] = bID
		}

		if dist[bID][aID] > edge.Weight {
			dist[bID][aID] = edge.Weight
			next[bID][aID] = aID
		}
	}

	// Build shortest-path matrix
	for k := 0; k < len(arena.Nodes); k++ {
		for i := 0; i < len(arena.Nodes); i++ {
			for j := 0; j < len(arena.Nodes); j++ {
				if dist[i][k]+dist[k][j] < dist[i][j] {
					dist[i][j] = dist[i][k] + dist[k][j]
					next[i][j] = next[i][k]
				}
			}
		}
	}

	return &Navigator{arena: arena, Dist: dist, Next: next}
}

// Distance returns the total distance between two nodes.
func (n *Navigator) Distance(from, to *Node) uint64 {
	return n.Dist[from.ID][to.ID]
}

// NextEdge returns the next edge to travel down on the path from -> to.
func (n *Navigator) NextEdge(from, to *Node) *Edge {
	if from == to {
		return nil
	}

	nextID := n.Next[from.ID][to.ID]

	for _, edge := range from.Edges {
		if edge.A.ID == nextID || edge.B.ID == nextID {
			return edge
		}
	}

	return nil
}

func initDistanceMatrix(nodes []*Node) [][]uint64 {
	dist := make([][]uint64, len(nodes))

	for i := range dist {
		dist[i] = make([]uint64, len(nodes))

		// The distance between every pair of nodes begins at "infinity".
		for j := range dist[i] {
			dist[i][j] = math.MaxInt64
		}

		// Except that every node is 0 away from itself.
		dist[i][i] = 0
	}

	return dist
}

func emptyMatrix(size int) [][]uint64 {
	m := make([][]uint64, size)
	for i := range m {
		m[i] = make([]uint64, size)
	}
	return m
}
