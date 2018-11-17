package arena

// A Node is a location in the arena.
type Node struct {
	ID uint
	X  uint
	Y  uint

	edges []*Edge
}
