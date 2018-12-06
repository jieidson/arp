package sim

import (
	"container/list"
	"fmt"
)

// AgentKind describes the type of an agent.
type AgentKind int

// The possible kinds of agents.
const (
	CivilianAgentKind AgentKind = iota
	OffenderAgentKind
	PoliceAgentKind
)

// String returns a string representation of an agent kind.
func (t AgentKind) String() string {
	switch t {
	case CivilianAgentKind:
		return "civilian"
	case OffenderAgentKind:
		return "offender"
	case PoliceAgentKind:
		return "police"
	}
	panic("unexpected agent kind")
}

// Ordinal returns an integer representation of an agent kind.
func (t AgentKind) Ordinal() uint64 {
	switch t {
	case CivilianAgentKind:
		return 0
	case OffenderAgentKind:
		return 1
	case PoliceAgentKind:
		return 2
	}
	panic("unexpected agent kind")
}

// An Agent is an entity in the arena, with a set of behavior.
type Agent struct {
	ID       uint64
	Kind     AgentKind
	Location *Node
	Behavior []Behavior

	locationElement *list.Element
}

// Init is run once when the simulation starts.
func (agent *Agent) Init(p *Provider) {
	for _, behavior := range agent.Behavior {
		behavior.Init(p, agent)
	}
}

// DayStart is run on the first tick of each simulation day.
func (agent *Agent) DayStart(p *Provider) {
	for _, behavior := range agent.Behavior {
		behavior.DayStart(p, agent)
	}
}

// Move is run in the first phase of every tick in agent ID order.
func (agent *Agent) Move(p *Provider) {
	for _, behavior := range agent.Behavior {
		behavior.Move(p, agent)
	}
}

// Action is run in the second phase of every tick in random order.
func (agent *Agent) Action(p *Provider) {
	for _, behavior := range agent.Behavior {
		behavior.Action(p, agent)
	}
}

// Log collects data about the agent at the end of every tick.
func (agent *Agent) Log(p *Provider, row *AgentDataRow) {
	row.ID = agent.ID
	row.Kind = uint64(agent.Kind)

	row.LocationID = agent.Location.ID
	row.X = agent.Location.X
	row.Y = agent.Location.Y

	for _, behavior := range agent.Behavior {
		behavior.Log(p, agent, row)
	}
}

func (agent *Agent) String() string {
	return fmt.Sprintf("A%d", agent.ID)
}

// Police retrieves the police behavior from this agent.
func (agent *Agent) Police() (*PoliceBehavior, bool) {
	for _, behavior := range agent.Behavior {
		if police, ok := behavior.(*PoliceBehavior); ok {
			return police, true
		}
	}
	return nil, false
}

// Civilian retrieves the civilian behavior from this agent.
func (agent *Agent) Civilian() (*CivilianBehavior, bool) {
	for _, behavior := range agent.Behavior {
		if civilian, ok := behavior.(*CivilianBehavior); ok {
			return civilian, true
		}
	}
	return nil, false
}

// Offender retrieves the offender behavior from this agent.
func (agent *Agent) Offender() (*OffenderBehavior, bool) {
	for _, behavior := range agent.Behavior {
		if offender, ok := behavior.(*OffenderBehavior); ok {
			return offender, true
		}
	}
	return nil, false
}
