package sim

import (
	"math"
)

// NewCivilianAgent creates a new Civilian agent.
func NewCivilianAgent(id uint64) *CivilianAgent {
	return &CivilianAgent{baseAgent: baseAgent{ID: id}}
}

// CivilianAgent implements normal civilian agent behavior.
type CivilianAgent struct {
	baseAgent

	Employed bool

	Home       *Node
	Work       *Node // If not employed, this is nil.
	Activities []*Node

	IsActive  bool
	AlarmTick uint64

	Target *Node

	MorningSleep uint64
	EveningSleep uint64

	WorkBusy       uint64
	ActivitiesBusy []uint64
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

// DayStart is run on the first tick of each simulation day.
func (agent *CivilianAgent) DayStart(p *Provider) {
	rng := p.RNG()

	var sleepTime uint64
	busyTime := uint64(math.MaxUint64)
	tries := 0

	for busyTime > p.Config.Time.TicksPerDay {
		if tries > 5 {
			panic("agent cannot determine reasonable activities within day")
		}

		sleepTime = rng.NormalUint64(
			p.Config.Activity.SleepMean, p.Config.Activity.SleepStdDev)

		agent.chooseActivities(p)

		// Total time for sleep and traveling to each activity. Assuming traveling one
		// edge a tick.
		busyTime = agent.totalBusyTime(p, sleepTime)

		tries++
	}

	agent.MorningSleep = rng.Uint64(0, sleepTime)
	agent.EveningSleep = sleepTime - agent.MorningSleep

	activityTime := p.Config.Time.TicksPerDay - sleepTime - busyTime

	if agent.Employed {
		// Pick a random amount of time to be at work, at least one tick, and leave at
		// least one tick for each activity.
		agent.WorkBusy = rng.Uint64(1, activityTime-uint64(len(agent.Activities)))
		activityTime -= agent.WorkBusy
	}

	agent.ActivitiesBusy = agent.ActivitiesBusy[:0]
	for i := range agent.Activities {
		time := rng.Uint64(1, activityTime-uint64(len(agent.Activities)-i))
		agent.ActivitiesBusy = append(agent.ActivitiesBusy, time)
	}

	if agent.Work != nil {
		agent.Target = agent.Work
	} else if len(agent.Activities) > 0 {
		agent.Target = agent.Activities[0]
	}

	agent.IsActive = false
	agent.AlarmTick = p.Simulator().CurrentTick + agent.MorningSleep
}

// Move is run in the first phase of every tick in agent ID order.
func (agent *CivilianAgent) Move(p *Provider) {
	if p.Simulator().CurrentTick == agent.AlarmTick {
		agent.IsActive = true
	}

	if !agent.IsActive {
		return
	}

}

// Log collects data about the agent at the end of every tick.
func (agent *CivilianAgent) Log(p *Provider, row *AgentDataRow) {
	agent.baseAgent.Log(p, row)

	row.Kind = uint64(CivilianAgentKind)
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

	// TODO: Make sure work location is not home location.
}

func (agent *CivilianAgent) chooseActivities(p *Provider) {
	cfg := p.Config.Activity
	arena := p.Arena()
	rng := p.RNG()

	activityCount := rng.NormalUint64(cfg.CountMean, cfg.CountStdDev)

	agent.Activities = agent.Activities[:0]

	for _, i := range rng.Perm(len(arena.Nodes)) {
		if uint64(len(agent.Activities)) == activityCount {
			break
		}

		node := arena.Nodes[i]

		// Don't want home or work as an activity location.
		if node == agent.Home || node == agent.Work {
			continue
		}

		agent.Activities = append(agent.Activities, node)
	}

	if uint64(len(agent.Activities)) != activityCount {
		panic("couldn't fill activity locations")
	}
}

func (agent *CivilianAgent) totalBusyTime(p *Provider, sleepTime uint64) uint64 {
	navigator := p.Navigator()
	totalTime := sleepTime

	// Assume at least one tick spent at work and each activity, so +1 to each
	// count.

	if agent.Work != nil {
		totalTime += navigator.EdgeDistance(agent.Home, agent.Work) + 1
	}

	if len(agent.Activities) > 0 {
		if agent.Work != nil {
			totalTime += navigator.EdgeDistance(agent.Work, agent.Activities[0]) + 1
		} else {
			totalTime += navigator.EdgeDistance(agent.Home, agent.Activities[0]) + 1
		}

		for i := 1; i < len(agent.Activities); i++ {
			lastNode := agent.Activities[i-1]
			node := agent.Activities[i]
			totalTime += navigator.EdgeDistance(lastNode, node) + 1
		}

		totalTime += navigator.EdgeDistance(
			agent.Activities[len(agent.Activities)-1], agent.Home)
	}

	return totalTime
}
