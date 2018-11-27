package sim

// NewPoliceAgent creates a new Police agent.
func NewPoliceAgent(id uint64) *PoliceAgent {
	return &PoliceAgent{baseAgent: baseAgent{ID: id}}
}

// A PoliceAgent picks a random starting location, and moves about randomly.
type PoliceAgent struct{ baseAgent }

// Init causes the police agent to pick a random starting location.
func (agent *PoliceAgent) Init(p *Provider) {
	agent.baseAgent.Init(p)

	// Pick a random node.
	node := p.RNG().Node(p.Arena().Nodes)

	// Set it as the starting location
	agent.enter(node)
}

// Move casues the police agent to pick a random edge at its current location
// and travel down it.
func (agent *PoliceAgent) Move(p *Provider) {
	agent.baseAgent.Move(p)

	// Pick a random edge.
	edge := p.RNG().Edge(agent.Location.Edges)

	// Walk down the edge
	agent.follow(edge)
}

// Log collects data about the agent at the end of every tick.
func (agent *PoliceAgent) Log(p *Provider, row *AgentDataRow) {
	agent.baseAgent.Log(p, row)

	row.Kind = uint64(PoliceAgentKind)
}
