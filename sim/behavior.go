package sim

// A Behavior describes how an agent can move and take an action during a
// simulation tick.
type Behavior interface {
	// Init is run once when the simulation starts.
	Init(agent *Agent, p *Provider)

	// Move is run in the first phase of every tick in agent ID order.
	Move(agent *Agent, p *Provider)

	// Action is run in the second phase of every tick in random order.
	Action(agent *Agent, p *Provider)

	// Log collects data about the agent at the end of every tick.
	Log(agent *Agent, p *Provider, row *AgentDataRow)
}

// BaseBehavior is a base behavior that does nothing
type BaseBehavior struct{}

// Init is run once when the simulation starts.
func (b *BaseBehavior) Init(agent *Agent, p *Provider) {}

// Move is run in the first phase of every tick in agent ID order.
func (b *BaseBehavior) Move(agent *Agent, p *Provider) {}

// Action is run in the second phase of every tick in random order.
func (b *BaseBehavior) Action(agent *Agent, p *Provider) {}

// Log collects data about the agent at the end of every tick.
func (b *BaseBehavior) Log(agent *Agent, p *Provider, row *AgentDataRow) {}

// PoliceBehavior causes an agent to pick a random starting location, and move
// about randomly.
type PoliceBehavior struct{}

// Init causes the police agent to pick a random starting location.
func (b *PoliceBehavior) Init(agent *Agent, p *Provider) {
	// Pick a random node.
	node := p.RNG().Node(p.Arena().Nodes)

	// Set it as the starting location
	node.Enter(agent)
}

// Move casues the police agent to pick a random edge at its current location
// and travel down it.
func (b *PoliceBehavior) Move(agent *Agent, p *Provider) {
	// Pick a random edge.
	edge := p.RNG().Edge(agent.Location.Edges)

	// Walk down the edge
	edge.Follow(agent)
}

// Action doesn't do anything for police agents.
func (b *PoliceBehavior) Action(agent *Agent, p *Provider) {}

// Log doesn't do anything for police agents.
func (b *PoliceBehavior) Log(agent *Agent, p *Provider, row *AgentDataRow) {}
