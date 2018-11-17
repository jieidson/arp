package arena

import (
	"github.com/jieidson/arp/config"
	"github.com/jieidson/arp/rng"
)

// MajorStreetsGrid generates an arena with major and minor streets.
func MajorStreetsGrid(c config.ArenaConfig, rng *rng.RNG) *Arena {
	nodes := make([]*Node, c.Width*c.Height)

	// Construct each arena node
	for y := uint(0); y < c.Height; y++ {
		for x := uint(0); x < c.Width; x++ {
			i := y*c.Width + x
			nodes[i] = &Node{ID: i, X: x, Y: y}
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
	for y := uint(0); y < c.Height; y++ {
		for x := uint(0); x < c.Width; x++ {
			i := y*c.Width + x
			node := nodes[i]

			// If there is a node below this node, link it
			if y+1 < c.Height {
				downi := (y+1)*c.Width + x
				downNode := nodes[downi]
				edge := link(node, downNode)

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
				edge := link(node, rightNode)

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
