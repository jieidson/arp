package sim

import (
	"math"
)

const maxActivityPlanningTries = 5

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
	agent.Home.Enter(agent)

	// If the agent is employed, choose a work location
	if agent.Employed {
		// Ensure that the work location is not the same as their home location.
		for agent.Work == nil || agent.Work == agent.Home {
			agent.chooseWork(p)
		}
	}
}

// DayStart is run on the first tick of each simulation day.
func (agent *CivilianAgent) DayStart(p *Provider) {
	sleepTime, busyTime := agent.planActivities(p)
	agent.scheduleDay(p, sleepTime, busyTime)

	// Choose today's first target
	if agent.Work != nil {
		agent.Target = agent.Work
	} else if len(agent.Activities) > 0 {
		agent.Target = agent.Activities[0]
	}

	agent.IsActive = false

	if agent.Target != nil {
		agent.AlarmTick = p.Simulator().CurrentTick + agent.MorningSleep
	} else {
		// If agent has nothing to do all day today, just sleep.
		agent.AlarmTick = p.Simulator().CurrentTick + p.Config.Time.TicksPerDay
	}
}

// Move is run in the first phase of every tick in agent ID order.
func (agent *CivilianAgent) Move(p *Provider) {
	if p.Simulator().CurrentTick == agent.AlarmTick {
		agent.IsActive = true
	}

	if !agent.IsActive {
		return
	}

	edge := p.Navigator().NextEdge(agent.Location, agent.Target)
	edge.Follow(agent)
}

// Action is run in the second phase of every tick in random order.
func (agent *CivilianAgent) Action(p *Provider) {
	if !agent.IsActive {
		return
	}

	// If the agent hasn't reached it's target yet, don't take an action.
	if agent.Location != agent.Target {
		return
	}

	// The agent reached it's target, become inactive
	agent.IsActive = false
	target, busyTicks := agent.pickNextTarget()

	agent.Target = target
	agent.AlarmTick = p.Simulator().CurrentTick + busyTicks
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
}

func (agent *CivilianAgent) planActivities(p *Provider) (uint64, uint64) {
	var tries int
	var sleepTime, busyTime uint64

	busyTime = math.MaxUint64

	for busyTime > p.Config.Time.TicksPerDay {
		if tries > 5 {
			panic("agent cannot determine reasonable activities within day")
		}

		sleepTime := p.RNG().NormalUint64(
			p.Config.Activity.SleepMean, p.Config.Activity.SleepStdDev)

		agent.chooseActivities(p)

		// Total time for sleep and traveling to each activity. Assuming traveling one
		// edge a tick.
		busyTime = agent.totalBusyTime(p, sleepTime)

		tries++
	}

	return sleepTime, busyTime
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

func (agent *CivilianAgent) scheduleDay(p *Provider, sleepTime, busyTime uint64) {
	agent.MorningSleep = p.RNG().Uint64(0, sleepTime)
	agent.EveningSleep = sleepTime - agent.MorningSleep

	activityTime := p.Config.Time.TicksPerDay - sleepTime - busyTime

	if agent.Employed {
		// Pick a random amount of time to be at work, at least one tick, and leave at
		// least one tick for each activity.
		agent.WorkBusy = p.RNG().Uint64(1, activityTime-uint64(len(agent.Activities)))
		activityTime -= agent.WorkBusy
	}

	agent.ActivitiesBusy = agent.ActivitiesBusy[:0]
	for i := range agent.Activities {
		time := p.RNG().Uint64(1, activityTime-uint64(len(agent.Activities)-i))
		agent.ActivitiesBusy = append(agent.ActivitiesBusy, time)
	}
}

func (agent *CivilianAgent) pickNextTarget() (*Node, uint64) {
	if agent.Location == agent.Home {
		// The agent just got home for the night, remain inactive until tomorrow.
		return nil, 0
	}

	if agent.Location == agent.Work {
		// The agent just got to work, stay there for the planned time.
		// After work, go to the first activity location, or home if there are none.
		if len(agent.Activities) > 0 {
			return agent.Activities[0], agent.WorkBusy
		}
		return agent.Home, agent.WorkBusy
	}

	// The agent just got to an activity location.
	for i, activity := range agent.Activities {
		if agent.Location == activity {
			// If at the last activity, go home, otherwise go to the next one.
			if i == len(agent.Activities)-1 {
				return agent.Home, agent.ActivitiesBusy[i]
			}
			return agent.Activities[i+1], agent.ActivitiesBusy[i]
		}
	}

	return nil, 0
}
