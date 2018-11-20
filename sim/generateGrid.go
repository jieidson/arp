package sim

import (
	"github.com/jieidson/arp/config"
)

// MajorStreetsGrid generates an arena with major and minor streets.
func MajorStreetsGrid(c config.ArenaConfig, rng *RNG) *Arena {
	nodes := make([]*Node, c.Width*c.Height)

	// Construct each arena node
	for y := uint64(0); y < c.Height; y++ {
		for x := uint64(0); x < c.Width; x++ {
			i := y*c.Width + x
			nodes[i] = &Node{
				ID:     i,
				X:      x,
				Y:      y,
				Agents: make(map[*Agent]bool),
			}
		}
	}

	// Chose some rows and columns to be major streets.
	var horizontalMajors []int
	for _, y := range rng.PermN(int(c.Height), int(c.MajorX)) {
		horizontalMajors = append(horizontalMajors, y)
	}

	var verticalMajors []int
	for _, x := range rng.PermN(int(c.Width), int(c.MajorY)) {
		verticalMajors = append(verticalMajors, x)
	}

	// Link them together in a grid
	var edges []*Edge
	for y := uint64(0); y < c.Height; y++ {
		for x := uint64(0); x < c.Width; x++ {
			i := y*c.Width + x
			node := nodes[i]

			// If there is a node below this node, link it
			if y+1 < c.Height {
				downi := (y+1)*c.Width + x
				downNode := nodes[downi]
				edge := Link(node, downNode)

				if inIntSlice(verticalMajors, int(x)) {
					edge.Weight = c.MajorWeight
				} else {
					edge.Weight = c.MinorWeight
				}

				edges = append(edges, edge)
			}

			// If there is a node to the right of this node, link it
			if x+1 < c.Width {
				righti := y*c.Width + (x + 1)
				rightNode := nodes[righti]
				edge := Link(node, rightNode)

				// If this row is a major street, set its weight appropriately.
				if inIntSlice(horizontalMajors, int(y)) {
					edge.Weight = c.MajorWeight
				} else {
					edge.Weight = c.MinorWeight
				}

				edges = append(edges, edge)
			}
		}
	}

	return &Arena{
		Width:  c.Width,
		Height: c.Height,
		Nodes:  nodes,
		Edges:  edges,
	}
}

func inIntSlice(s []int, x int) bool {
	for _, i := range s {
		if i == x {
			return true
		}
	}
	return false
}
