package sim

// Behavior describes a subset of agent functionality.
type Behavior interface {
	// Init is run once when the simulation starts.
	Init(p *Provider, agent *Agent)

	// DayStart is run on the first tick of each simulation day.
	DayStart(p *Provider, agent *Agent)

	// Move is run in the first phase of every tick in agent ID order.
	Move(p *Provider, agent *Agent)

	// Action is run in the second phase of every tick in random order.
	Action(p *Provider, agent *Agent)

	// Log collects data about the agent at the end of every tick.
	Log(p *Provider, agent *Agent, row *AgentDataRow)
}

type baseBehavior struct{}

// Init is run once when the simulation starts.
func (*baseBehavior) Init(p *Provider, agent *Agent) {}

// DayStart is run on the first tick of each simulation day.
func (*baseBehavior) DayStart(p *Provider, agent *Agent) {}

// Move is run in the first phase of every tick in agent ID order.
func (*baseBehavior) Move(p *Provider, agent *Agent) {}

// Action is run in the second phase of every tick in random order.
func (*baseBehavior) Action(p *Provider, agent *Agent) {}

// Log collects data about the agent at the end of every tick.
func (*baseBehavior) Log(p *Provider, agent *Agent, row *AgentDataRow) {}
