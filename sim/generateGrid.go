package sim

import (
	"github.com/jieidson/arp/config"
	"math"
)

// GridArena generates a grid shaped arena.
func GridArena(c config.ArenaConfig) *Arena {
	arena := &Arena{
		Width:  c.Width,
		Height: c.Height,

		// A MxN grid has M*N nodes, and 2MN - M -N edges.
		// http://mathworld.wolfram.com/GridGraph.html
		Nodes: make([]*Node, 0, c.Width*c.Height),
		Edges: make([]*Edge, 0, (2*c.Width*c.Height)-c.Width-c.Height),
	}

	// Construct each arena node
	for y := uint64(0); y < c.Height; y++ {
		for x := uint64(0); x < c.Width; x++ {
			node := &Node{
				ID: arena.Index(x, y),
				X:  x,
				Y:  y,
			}
			arena.Nodes = append(arena.Nodes, node)
		}
	}

	// Link them together in a grid
	var edges []*Edge
	for y := uint64(0); y < c.Height; y++ {
		for x := uint64(0); x < c.Width; x++ {
			node := arena.Node(x, y)

			// If there is a node below this node, link it
			if y+1 < c.Height {
				downNode := arena.Node(x, y+1)
				edges = append(edges, Link(node, downNode))
			}

			// If there is a node to the right of this node, link it
			if x+1 < c.Width {
				rightNode := arena.Node(x+1, y)
				edges = append(edges, Link(node, rightNode))
			}
		}
	}

	return arena
}

// MajorStreetGridArena generates an arena with major and minor streets.
func MajorStreetGridArena(c config.ArenaConfig, rng *RNG) *Arena {
	// Generate a normal grid arena.
	arena := GridArena(c)

	// Chose some rows and columns to be major streets.
	var horizontalMajors []uint64
	for _, y := range rng.PermN(int(c.Height), int(c.MajorX)) {
		horizontalMajors = append(horizontalMajors, uint64(y))
	}

	var verticalMajors []uint64
	for _, x := range rng.PermN(int(c.Width), int(c.MajorY)) {
		verticalMajors = append(verticalMajors, uint64(x))
	}

	// Determine the intersection type of each node.
	for y := uint64(0); y < c.Height; y++ {
		for x := uint64(0); x < c.Width; x++ {
			node := arena.Node(x, y)

			isVertialMajor := inUint64Slice(verticalMajors, x)
			isHorizontalMajor := inUint64Slice(horizontalMajors, y)

			if isVertialMajor && isHorizontalMajor {
				node.Intersection = MajorMajorIntersection

			} else if isVertialMajor || isHorizontalMajor {
				node.Intersection = MajorMinorIntersection

			} else {
				node.Intersection = MinorMinorIntersection
			}
		}
	}

	// Set the appropriate edge weights for each edge.
	for _, edge := range arena.Edges {
		// Default to minor street
		edge.Weight = c.MinorWeight

		if edge.A.X == edge.B.X && inUint64Slice(horizontalMajors, edge.A.X) {
			// This is a horizontal edge, and a horizontal major street
			edge.Weight = c.MajorWeight

		} else if edge.A.Y == edge.B.Y && inUint64Slice(verticalMajors, edge.A.X) {
			// This is a vertical edge, and a vertical major street
			edge.Weight = c.MajorWeight

		} else {
			panic("can't determine direction of edge")
		}
	}

	return arena
}

// MoralContextArena creates a grid arena with low moral context areas.
func MoralContextArena(c config.Config, rng *RNG) *Arena {
	// Generate a major street grid arena.
	arena := MajorStreetGridArena(c.Arena, rng)

	// Collect nodes into intersection type categories
	var majorMajor, majorMinor, minorMinor []*Node

	for _, node := range arena.Nodes {
		// Default to high moral context
		node.Morals = HighMoralContext

		switch node.Intersection {
		case MajorMajorIntersection:
			majorMajor = append(majorMajor, node)

		case MajorMinorIntersection:
			majorMinor = append(majorMinor, node)

		case MinorMinorIntersection:
			minorMinor = append(minorMinor, node)

		default:
			panic("unexpected intersection type")
		}
	}

	// Helper function to pick a radius for each low moral context assignment.
	getRadius := func() int {
		n := rng.Normal(float64(c.Moral.RadiusMean), float64(c.Moral.RadiusStdDev))
		return int(math.Round(n))
	}

	// Helper function to mark nodes as low moral context.
	markLow := func(nodes []*Node, rate uint64) {
		for _, i := range rng.PermRate(len(nodes), int(rate)) {
			arena.Nodes[i].Walk(getRadius(), func(n *Node) {
				n.Morals = LowMoralContext
			})
		}
	}

	// Mark a percentage of them as low moral context.
	markLow(majorMajor, c.Moral.MajorMajorLow)
	markLow(majorMinor, c.Moral.MajorMinorLow)
	markLow(minorMinor, c.Moral.MinorMinorLow)

	return arena
}

func inUint64Slice(s []uint64, x uint64) bool {
	for _, i := range s {
		if i == x {
			return true
		}
	}
	return false
}
