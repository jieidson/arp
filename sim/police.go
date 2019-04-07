package sim

// NewPoliceAgent creates a new Police agent.
func NewPoliceAgent(id uint64) *Agent {
	return &Agent{
		ID:       id,
		Kind:     PoliceAgentKind,
		Behavior: []Behavior{&PoliceBehavior{}},
	}
}

// PoliceBehavior picks a random starting location, and moves about randomly.
type PoliceBehavior struct{ baseBehavior }

// Init causes the police agent to pick a random starting location.
func (police *PoliceBehavior) Init(p *Provider, agent *Agent) {
	// Pick a random node.
	node := p.RNG().Node(p.Arena().Nodes)

	// Set it as the starting location
	node.Enter(agent)

	node.TotalPolice++
}

// DayStart is run on the first tick of each simulation day.
func (police *PoliceBehavior) DayStart(p *Provider, agent *Agent) {}

// Move casues the police agent to pick a random edge at its current location
// and travel down it.
func (police *PoliceBehavior) Move(p *Provider, agent *Agent) {
	// Pick a random edge.
	edge := p.RNG().Edge(agent.Location.Edges)

	// Walk down the edge
	edge.Follow(agent)

	agent.TravelDistance++
	agent.Location.TotalPolice++
}
