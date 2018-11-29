package sim

import (
	"math"
)

// Navigator determines the shortest path between two nodes in an arena.
type Navigator struct {
	arena *Arena

	// Distance matrix, counting weights.
	Dist [][]uint64

	// Distance matrix, counting edges.
	EdgeDist [][]uint64

	// Table for next node ID in path between two nodes.
	Next [][]uint64
}

// NewNavigator creates a new Navigator from an Arena.
func NewNavigator(arena *Arena) *Navigator {
	navigator := &Navigator{
		arena:    arena,
		Dist:     initDistanceMatrix(arena.Nodes),
		EdgeDist: initDistanceMatrix(arena.Nodes),
		Next:     emptyMatrix(len(arena.Nodes)),
	}

	floydWarshall(navigator)

	return navigator
}

// Distance returns the total distance (counting edge weights) between two
// nodes.
func (n *Navigator) Distance(from, to *Node) uint64 {
	return n.Dist[from.ID][to.ID]
}

// EdgeDistance returns the total number of edges between two nodes.
func (n *Navigator) EdgeDistance(from, to *Node) uint64 {
	return n.EdgeDist[from.ID][to.ID]
}

// NextEdge returns the next edge to travel down on the path from -> to.
func (n *Navigator) NextEdge(from, to *Node) *Edge {
	if from == to {
		return nil
	}

	nextID := n.Next[to.ID][from.ID]

	for _, edge := range from.Edges {
		if edge.A.ID == nextID || edge.B.ID == nextID {
			return edge
		}
	}

	return nil
}

func emptyMatrix(size int) [][]uint64 {
	storage := make([]uint64, size*size)
	mat := make([][]uint64, size)

	for i := 0; i < size; i++ {
		n := i * size
		mat[i] = storage[n : n+size]
	}

	return mat
}

func initDistanceMatrix(nodes []*Node) [][]uint64 {
	dist := emptyMatrix(len(nodes))

	for i := 0; i < len(nodes); i++ {
		for j := 0; j < len(nodes); j++ {
			// The distance between every pair of nodes begins at "infinity".
			dist[i][j] = math.MaxUint64
		}

		// Except that every node is 0 away from itself.
		dist[i][i] = 0
	}

	return dist
}

func floydWarshall(nav *Navigator) {
	size := len(nav.arena.Nodes)

	d := nav.Dist
	n := nav.Next
	e := nav.EdgeDist

	// Record the distance between each pair of nodes that have an edge between
	// them.
	for _, edge := range nav.arena.Edges {
		if d[edge.A.ID][edge.B.ID] > edge.Weight {
			d[edge.A.ID][edge.B.ID] = edge.Weight
			n[edge.A.ID][edge.B.ID] = edge.B.ID
			e[edge.A.ID][edge.B.ID] = 1
		}

		if d[edge.B.ID][edge.A.ID] > edge.Weight {
			d[edge.B.ID][edge.A.ID] = edge.Weight
			n[edge.B.ID][edge.A.ID] = edge.B.ID
			e[edge.B.ID][edge.A.ID] = 1
		}
	}

	// Build shortest-path matrix
	for k := 0; k < size; k++ {
		for i := 0; i < size; i++ {
			dIK := d[i][k]

			for j := 0; j < size; j++ {
				ij := &d[i][j]

				dIKJ := dIK + d[k][j]
				if *ij > dIKJ {
					*ij = dIKJ
					n[i][j] = n[i][k]
					e[i][j] = e[i][k] + e[k][j]
				}

			}
		}
	}
}

func floydWarshall2(nav *Navigator) {
	size := len(nav.arena.Nodes)

	d := nav.Dist
	n := nav.Next
	e := nav.EdgeDist

	// Record the distance between each pair of nodes that have an edge between
	// them.
	for _, edge := range nav.arena.Edges {
		if d[edge.A.ID][edge.B.ID] > edge.Weight {
			d[edge.A.ID][edge.B.ID] = edge.Weight
			n[edge.A.ID][edge.B.ID] = edge.B.ID
			e[edge.A.ID][edge.B.ID] = 1
		}

		if d[edge.B.ID][edge.A.ID] > edge.Weight {
			d[edge.B.ID][edge.A.ID] = edge.Weight
			n[edge.B.ID][edge.A.ID] = edge.B.ID
			e[edge.B.ID][edge.A.ID] = 1
		}
	}

	// Build shortest-path matrix
	for k := 0; k < size; k++ {
		for i := 0; i < k; i++ {
			dIK := d[i][k]

			for j := 0; j <= i; j++ {
				ij := &d[i][j]

				dIKJ := dIK + d[j][k]
				if *ij > dIKJ {
					*ij = dIKJ
					n[i][j] = n[i][k]
					e[i][j] = e[i][k] + e[j][k]
				}
			}
		}

		for i := k; i < size; i++ {
			dKI := d[k][i]

			for j := 0; j < k; j++ {
				ij := &d[i][j]

				dIKJ := dKI + d[j][k]
				if *ij > dIKJ {
					*ij = dIKJ
					n[i][j] = n[k][i]
					e[i][j] = e[k][i] + e[j][k]
				}
			}

			for j := k; j <= i; j++ {
				ij := &d[i][j]

				dIKJ := dKI + d[k][j]
				if *ij > dIKJ {
					*ij = dIKJ
					n[i][j] = n[k][i]
					e[i][j] = e[k][i] + e[k][j]
				}
			}
		}

	}
}
