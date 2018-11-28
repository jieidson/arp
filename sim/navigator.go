package sim

import (
	"log"
	"math"
	"sync"
)

// Navigator determines the shortest path between two nodes in an arena.
type Navigator struct {
	arena *Arena

	// Distance matrix.
	Dist []uint64

	// Table for next node ID in path between two nodes.
	Next []uint64
}

// NewNavigator creates a new Navigator from an Arena.
func NewNavigator(arena *Arena) *Navigator {
	navigator := &Navigator{
		arena: arena,
		Dist:  initDistanceMatrix(arena.Nodes),
		Next:  make([]uint64, len(arena.Nodes)*len(arena.Nodes)),
	}

	floydWarshallParallel(navigator)

	return navigator
}

// Distance returns the total distance between two nodes.
func (n *Navigator) Distance(from, to *Node) uint64 {
	return n.Dist[to.ID*uint64(len(n.arena.Nodes))+from.ID]
}

// NextEdge returns the next edge to travel down on the path from -> to.
func (n *Navigator) NextEdge(from, to *Node) *Edge {
	if from == to {
		return nil
	}

	nextID := n.Next[to.ID*uint64(len(n.arena.Nodes))+from.ID]

	for _, edge := range from.Edges {
		if edge.A.ID == nextID || edge.B.ID == nextID {
			return edge
		}
	}

	return nil
}

func (n *Navigator) index(a, b uint64) uint64 {
	return indexUint64(a, b, uint64(len(n.arena.Nodes)))
}

func initDistanceMatrix(nodes []*Node) []uint64 {
	dist := make([]uint64, len(nodes)*len(nodes))

	for y := 0; y < len(nodes); y++ {
		for x := 0; x < len(nodes); x++ {
			i := y*len(nodes) + x

			// The distance between every pair of nodes begins at "infinity".
			dist[i] = math.MaxUint64

		}

		// Except that every node is 0 away from itself.
		dist[y*len(nodes)+y] = 0
	}

	return dist
}

// All-pairs shortest path algorithm
// https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
// Based on: https://github.com/cytoscape/cytoscape.js/blob/master/src/collection/algorithms/floyd-warshall.js
func floydWarshallParallel(n *Navigator) {
	size := len(n.arena.Nodes)

	// Record the distance between each pair of nodes that have an edge between
	// them.
	for _, edge := range n.arena.Edges {
		ai := n.index(edge.B.ID, edge.A.ID)
		bi := n.index(edge.A.ID, edge.B.ID)

		if n.Dist[ai] > edge.Weight {
			n.Dist[ai] = edge.Weight
			n.Next[ai] = edge.B.ID
		}

		if n.Dist[bi] > edge.Weight {
			n.Dist[bi] = edge.Weight
			n.Next[bi] = edge.A.ID
		}
	}

	// Build shortest-path matrix
	var lock sync.Mutex
	runParallel(size, func(id, start, end int) {
		for z := start; z < end; z++ {
			for x := 0; x < size; x++ {
				for y := 0; y < size; y++ {

					xyi := indexInt(x, y, size)
					xzi := indexInt(x, z, size)
					zyi := indexInt(z, y, size)

					lock.Lock()
					d := n.Dist[xzi] + n.Dist[zyi]

					if d < n.Dist[xyi] {
						n.Dist[xyi] = d
						n.Next[xyi] = n.Next[xzi]
					}
					lock.Unlock()

				}
			}
			log.Println(id, "finished Z", z)
		}
	})
}
