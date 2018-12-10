package sim

import (
	"math"
)

const maxActivityPlanningTries = 5

// NewCivilianAgent creates a new Civilian agent.
func NewCivilianAgent(id uint64) *Agent {
	return &Agent{
		ID:       id,
		Kind:     CivilianAgentKind,
		Behavior: []Behavior{&CivilianBehavior{}},
	}
}

// CivilianBehavior implements normal civilian agent behavior.
type CivilianBehavior struct {
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

	Wealth int64
}

// Init causes the civilian agent to randomly choose a home location.
func (civilian *CivilianBehavior) Init(p *Provider, agent *Agent) {
	// Pick a random node for the home location.
	civilian.Home = p.RNG().Node(p.Arena().Nodes)

	// Set it as the starting location
	civilian.Home.Enter(agent)

	// If the agent is employed, choose a work location
	if civilian.Employed {
		// Ensure that the work location is not the same as their home location.
		for civilian.Work == nil || civilian.Work == civilian.Home {
			civilian.chooseWork(p)
		}
	}

	// Start with some amount of money.
	civilian.Wealth = p.RNG().NormalInt64(
		int64(p.Config.Economy.WealthMean), int64(p.Config.Economy.WealthStdDev))
	if civilian.Wealth < 0 {
		civilian.Wealth = 0
	}
}

// DayStart is run on the first tick of each simulation day.
func (civilian *CivilianBehavior) DayStart(p *Provider, agent *Agent) {
	sleepTime, busyTime := civilian.planActivities(p)
	civilian.scheduleDay(p, sleepTime, busyTime)

	// Choose today's first target
	if civilian.Work != nil {
		civilian.Target = civilian.Work
	} else if len(civilian.Activities) > 0 {
		civilian.Target = civilian.Activities[0]
	}

	civilian.IsActive = false

	if civilian.Target != nil {
		civilian.AlarmTick = p.Simulator().CurrentTick + civilian.MorningSleep
	} else {
		// If agent has nothing to do all day today, just sleep.
		civilian.AlarmTick = p.Simulator().CurrentTick + p.Config.Time.TicksPerDay
	}
}

// Move is run in the first phase of every tick in agent ID order.
func (civilian *CivilianBehavior) Move(p *Provider, agent *Agent) {
	if p.Simulator().CurrentTick == civilian.AlarmTick {
		civilian.IsActive = true
	}

	if !civilian.IsActive {
		return
	}

	edge := p.Navigator().NextEdge(agent.Location, civilian.Target)
	edge.Follow(agent)
}

// Action is run in the second phase of every tick in random order.
func (civilian *CivilianBehavior) Action(p *Provider, agent *Agent) {
	if !civilian.IsActive {
		return
	}

	// If the agent hasn't reached it's target yet, don't take an action.
	if agent.Location != civilian.Target {
		return
	}

	// The agent reached it's target, become inactive
	civilian.IsActive = false
	target, busyTicks := civilian.pickNextTarget(agent)

	civilian.Target = target
	civilian.AlarmTick = p.Simulator().CurrentTick + busyTicks
}

// Log collects data about the agent at the end of every tick.
func (civilian *CivilianBehavior) Log(p *Provider, agent *Agent, row *AgentDataRow) {
	row.HomeID = civilian.Home.ID
	if civilian.Work == nil {
		row.WorkID = -1
	} else {
		row.WorkID = int64(civilian.Work.ID)
	}

	row.Activities = make([]uint64, len(civilian.Activities))
	for i, activity := range civilian.Activities {
		row.Activities[i] = activity.ID
	}

	row.AtRisk = civilian.IsActive
	row.Wealth = uint64(civilian.Wealth)
}

func (civilian *CivilianBehavior) chooseWork(p *Provider) {
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
	civilian.Work = p.RNG().Node(workspaces)
}

func (civilian *CivilianBehavior) planActivities(p *Provider) (uint64, uint64) {
	var tries int
	var sleepTime, busyTime uint64

	busyTime = math.MaxUint64

	for busyTime > p.Config.Time.TicksPerDay {
		if tries > 5 {
			panic("agent cannot determine reasonable activities within day")
		}

		sleepTime := p.RNG().NormalUint64(
			p.Config.Activity.SleepMean, p.Config.Activity.SleepStdDev)

		civilian.chooseActivities(p)

		// Total time for sleep and traveling to each activity. Assuming traveling one
		// edge a tick.
		busyTime = civilian.totalBusyTime(p, sleepTime)

		tries++
	}

	return sleepTime, busyTime
}

func (civilian *CivilianBehavior) chooseActivities(p *Provider) {
	cfg := p.Config.Activity
	arena := p.Arena()
	rng := p.RNG()

	activityCount := rng.NormalUint64(cfg.CountMean, cfg.CountStdDev)

	civilian.Activities = civilian.Activities[:0]

	for _, i := range rng.Perm(len(arena.Nodes)) {
		if uint64(len(civilian.Activities)) == activityCount {
			break
		}

		node := arena.Nodes[i]

		// Don't want home or work as an activity location.
		if node == civilian.Home || node == civilian.Work {
			continue
		}

		civilian.Activities = append(civilian.Activities, node)
	}

	if uint64(len(civilian.Activities)) != activityCount {
		panic("couldn't fill activity locations")
	}
}

func (civilian *CivilianBehavior) totalBusyTime(p *Provider, sleepTime uint64) uint64 {
	navigator := p.Navigator()
	totalTime := sleepTime

	// Assume at least one tick spent at work and each activity, so +1 to each
	// count.

	if civilian.Work != nil {
		totalTime += navigator.EdgeDistance(civilian.Home, civilian.Work) + 1
	}

	if len(civilian.Activities) > 0 {
		if civilian.Work != nil {
			totalTime += navigator.EdgeDistance(civilian.Work, civilian.Activities[0]) + 1
		} else {
			totalTime += navigator.EdgeDistance(civilian.Home, civilian.Activities[0]) + 1
		}

		for i := 1; i < len(civilian.Activities); i++ {
			lastNode := civilian.Activities[i-1]
			node := civilian.Activities[i]
			totalTime += navigator.EdgeDistance(lastNode, node) + 1
		}

		totalTime += navigator.EdgeDistance(
			civilian.Activities[len(civilian.Activities)-1], civilian.Home)
	}

	return totalTime
}

func (civilian *CivilianBehavior) scheduleDay(p *Provider, sleepTime, busyTime uint64) {
	civilian.MorningSleep = p.RNG().Uint64(0, sleepTime)
	civilian.EveningSleep = sleepTime - civilian.MorningSleep

	activityTime := p.Config.Time.TicksPerDay - sleepTime - busyTime

	if civilian.Employed {
		// Pick a random amount of time to be at work, at least one tick, and leave at
		// least one tick for each activity.
		civilian.WorkBusy = p.RNG().Uint64(1, activityTime-uint64(len(civilian.Activities)))
		activityTime -= civilian.WorkBusy
	}

	civilian.ActivitiesBusy = civilian.ActivitiesBusy[:0]
	for i := range civilian.Activities {
		time := p.RNG().Uint64(1, activityTime-uint64(len(civilian.Activities)-i))
		civilian.ActivitiesBusy = append(civilian.ActivitiesBusy, time)
	}
}

func (civilian *CivilianBehavior) pickNextTarget(agent *Agent) (*Node, uint64) {
	if agent.Location == civilian.Home {
		// The agent just got home for the night, remain inactive until tomorrow.
		return nil, 0
	}

	if agent.Location == civilian.Work {
		// The agent just got to work, stay there for the planned time.
		// After work, go to the first activity location, or home if there are none.
		if len(civilian.Activities) > 0 {
			return civilian.Activities[0], civilian.WorkBusy
		}
		return civilian.Home, civilian.WorkBusy
	}

	// The agent just got to an activity location.
	for i, activity := range civilian.Activities {
		if agent.Location == activity {
			// If at the last activity, go home, otherwise go to the next one.
			if i == len(civilian.Activities)-1 {
				return civilian.Home, civilian.ActivitiesBusy[i]
			}
			return civilian.Activities[i+1], civilian.ActivitiesBusy[i]
		}
	}

	return nil, 0
}
