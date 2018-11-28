package sim

// NewCivilianAgent creates a new Civilian agent.
func NewCivilianAgent(id uint64) *CivilianAgent {
	return &CivilianAgent{baseAgent: baseAgent{ID: id}}
}

// CivilianAgent implements normal civilian agent behavior.
type CivilianAgent struct {
	baseAgent

	Employed bool

	Home *Node
	Work *Node // If not employed, this is nil.
}

// Init causes the civilian agent to randomly choose a home location.
func (agent *CivilianAgent) Init(p *Provider) {
	agent.baseAgent.Init(p)

	// Pick a random node for the home location.
	agent.Home = p.RNG().Node(p.Arena().Nodes)

	// Set it as the starting location
	agent.enter(agent.Home)

	if agent.Employed {
		agent.chooseWork(p)
	}

}

func (agent *CivilianAgent) chooseWork(p *Provider) {
	cfg := p.Config.Workspace
	arena := p.Arena()

	// The set of eligible workspaces.
	var workspaces []*Node

	// The categories of workspaces to choose from. The sum of the chances needs to
	// add up to 100.
	choices := []struct {
		chance     uint64
		workspaces []*Node
	}{
		{cfg.MajorMajorLow, arena.MajorMajorLow},
		{cfg.MajorMajorHigh, arena.MajorMajorHigh},
		{cfg.MajorMinorLow, arena.MajorMinorLow},
		{cfg.MajorMinorHigh, arena.MajorMinorHigh},
		{cfg.MinorMinorLow, arena.MinorMinorLow},
		{cfg.MinorMinorHigh, arena.MinorMinorHigh},
	}

	// Roll a number between 0-100.
	roll := uint64(p.RNG().Int64(0, 100))

	// Figure out what choice that roll lands us in.
	for _, choice := range choices {
		if roll < choice.chance {
			workspaces = choice.workspaces
		}
		roll -= choice.chance
	}

	if workspaces == nil {
		panic("couldn't pick workspace category?")
	}

	// Pick a random node from the the chosen category.
	agent.Work = p.RNG().Node(workspaces)
}
