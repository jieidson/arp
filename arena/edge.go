package arena

// An Edge is a bi-directional link between two Nodes in the arena.
type Edge struct {
	A *Node
	B *Node

	Weight uint
}
