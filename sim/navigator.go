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
func NewNavigator(p *Provider) *Navigator {
	arena := p.Arena()
	navigator := &Navigator{
		arena:    arena,
		Dist:     initDistanceMatrix(arena.Nodes),
		EdgeDist: initDistanceMatrix(arena.Nodes),
		Next:     emptyMatrix(len(arena.Nodes)),
	}

	// floydWarshall(navigator, p)
	floydWarshall2(navigator, p)

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

	for i := range mat {
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

func floydWarshall(nav *Navigator, p *Provider) {
	size := len(nav.arena.Nodes)

	dist := nav.Dist
	next := nav.Next
	edist := nav.EdgeDist

	// Record the distance between each pair of nodes that have an edge between
	// them.
	for _, edge := range nav.arena.Edges {
		if dist[edge.A.ID][edge.B.ID] > edge.Weight {
			dist[edge.A.ID][edge.B.ID] = edge.Weight
			next[edge.A.ID][edge.B.ID] = edge.B.ID
			edist[edge.A.ID][edge.B.ID] = 1
		}

		if dist[edge.B.ID][edge.A.ID] > edge.Weight {
			dist[edge.B.ID][edge.A.ID] = edge.Weight
			next[edge.B.ID][edge.A.ID] = edge.A.ID
			edist[edge.B.ID][edge.A.ID] = 1
		}
	}

	step := size / 100
	for step*100 < size {
		step++
	}

	// Build shortest-path matrix
	for k := 0; k < size; k++ {
		for i := 0; i < size; i++ {
			dIK := dist[i][k]
			if dIK == math.MaxUint64 {
				continue
			}

			for j := 0; j < size; j++ {
				dKJ := dist[k][j]
				if dKJ == math.MaxUint64 {
					continue
				}

				ij := &dist[i][j]
				dIKJ := dIK + dKJ

				if *ij > dIKJ {
					*ij = dIKJ
					next[i][j] = next[i][k]
					edist[i][j] = edist[i][k] + edist[k][j]
				}

			}
		}

		if k%step == 0 {
			p.Logger().Printf("navigation table %.0f%% complete (%d of %d)",
				float64(k)/float64(size)*100, k, size)
		}
	}
}

func floydWarshall2(nav *Navigator, p *Provider) {
	size := len(nav.arena.Nodes)

	dist := nav.Dist
	next := nav.Next
	edist := nav.EdgeDist

	// Record the distance between each pair of nodes that have an edge between
	// them.
	for _, edge := range nav.arena.Edges {
		if dist[edge.A.ID][edge.B.ID] > edge.Weight {
			dist[edge.A.ID][edge.B.ID] = edge.Weight
			next[edge.A.ID][edge.B.ID] = edge.B.ID
			edist[edge.A.ID][edge.B.ID] = 1
		}

		if dist[edge.B.ID][edge.A.ID] > edge.Weight {
			dist[edge.B.ID][edge.A.ID] = edge.Weight
			next[edge.B.ID][edge.A.ID] = edge.A.ID
			edist[edge.B.ID][edge.A.ID] = 1
		}
	}

	step := size / 100
	for step*100 < size {
		step++
	}

	// Build shortest-path matrix
	for k := 0; k < size; k++ {
		for i := 0; i < k; i++ {
			dIK := dist[i][k]

			if dIK == math.MaxUint64 {
				continue
			}

			for j := 0; j <= i; j++ {
				dKJ := dist[j][k]
				if dKJ == math.MaxUint64 {
					continue
				}

				ij := &dist[i][j]
				dIKJ := dIK + dKJ

				if *ij > dIKJ {
					*ij = dIKJ
					next[i][j] = next[i][k]
					edist[i][j] = edist[i][k] + edist[j][k]

					dist[j][i] = dIKJ
					next[j][i] = next[i][k]
					edist[j][i] = edist[i][k] + edist[j][k]
				}
			}
		}

		for i := k; i < size; i++ {
			dKI := dist[k][i]
			if dKI == math.MaxUint64 {
				continue
			}

			for j := 0; j < k; j++ {
				dKJ := dist[j][k]
				if dKJ == math.MaxUint64 {
					continue
				}

				ij := &dist[i][j]
				dIKJ := dKI + dKJ

				if *ij > dIKJ {
					*ij = dIKJ
					next[i][j] = next[k][i]
					edist[i][j] = edist[k][i] + edist[j][k]

					dist[j][i] = dIKJ
					next[j][i] = next[k][i]
					edist[j][i] = edist[k][i] + edist[j][k]
				}
			}

			for j := k; j <= i; j++ {
				dKJ := dist[k][j]
				if dKJ == math.MaxUint64 {
					continue
				}

				ij := &dist[i][j]
				dIKJ := dKI + dKJ

				if *ij > dIKJ {
					*ij = dIKJ
					next[i][j] = next[k][i]
					edist[i][j] = edist[k][i] + edist[k][j]

					dist[j][i] = dIKJ
					next[j][i] = next[k][i]
					edist[j][i] = edist[k][i] + edist[k][j]
				}
			}
		}

		if k%step == 0 {
			p.Logger().Printf("navigation table %.0f%% complete (%d of %d)",
				float64(k)/float64(size)*100, k, size)
		}
	}
}
