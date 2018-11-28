package sim

import (
	"math"
	"runtime"
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
	// All-pairs shortest path algorithm
	// https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
	// Based on: https://github.com/cytoscape/cytoscape.js/blob/master/src/collection/algorithms/floyd-warshall.js

	// Distance matrix
	dist := initDistanceMatrix(arena.Nodes)

	size := len(arena.Nodes)

	// Table for next node in path between two nodes.
	next := make([]uint64, size*size)

	// Record the distance between each pair of nodes that have an edge between
	// them.
	for _, edge := range arena.Edges {
		ai := edge.B.ID*uint64(size) + edge.A.ID
		bi := edge.A.ID*uint64(size) + edge.B.ID

		if dist[ai] > edge.Weight {
			dist[ai] = edge.Weight
			next[ai] = edge.B.ID
		}

		if dist[bi] > edge.Weight {
			dist[bi] = edge.Weight
			next[bi] = edge.A.ID
		}
	}

	// Build shortest-path matrix
	ncpu := runtime.NumCPU() - 1
	increment := size / ncpu

	var wg sync.WaitGroup
	wg.Add(ncpu)

	var lock sync.Mutex

	for p := 0; p < ncpu; p++ {
		start := increment * p
		end := start + increment

		if size%ncpu != 0 && p == ncpu-1 {
			end = size
		}

		go func(p, start, end int) {
			defer wg.Done()

			for z := start; z < end; z++ {
				for x := 0; x < size; x++ {
					for y := 0; y < size; y++ {

						xyi := y*size + x
						xzi := z*size + x
						zyi := y*size + z

						lock.Lock()
						d := dist[xzi] + dist[zyi]

						if d < dist[xyi] {
							dist[xyi] = d
							next[xyi] = next[xzi]
						}
						lock.Unlock()
					}
				}
			}
		}(p, start, end)
	}

	wg.Wait()

	return &Navigator{arena: arena, Dist: dist, Next: next}
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
