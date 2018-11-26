package sim

import (
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

// An Agent is a location and collection of behavior.
type Agent struct {
	ID   uint64
	Kind AgentKind

	Location  *Node
	Behaviors []Behavior
}

// NewAgent creates a new Agent.
func NewAgent(behaviors ...Behavior) *Agent {
	return &Agent{Behaviors: behaviors}
}

// String returns a string representation of this agent.
func (a *Agent) String() string {
	return fmt.Sprintf("A%d (%v)", a.ID, a.Kind)
}

// Init causes this agent to execute all of its init behaviors.
func (a *Agent) Init(p *Provider) {
	for _, behavior := range a.Behaviors {
		behavior.Init(a, p)
	}
}

// Move causes this agent to execute all of its move behaviors.
func (a *Agent) Move(p *Provider) {
	for _, behavior := range a.Behaviors {
		behavior.Move(a, p)
	}
}

// Action causes this agent to execute all of its action behaviors.
func (a *Agent) Action(p *Provider) {
	for _, behavior := range a.Behaviors {
		behavior.Action(a, p)
	}
}

// Log causes this agent to execute all of its log behaviors.
func (a *Agent) Log(p *Provider, row *AgentDataRow) {
	row.ID = a.ID
	row.Kind = a.Kind.Ordinal()

	row.LocationID = a.Location.ID
	row.X = a.Location.X
	row.Y = a.Location.Y

	for _, behavior := range a.Behaviors {
		behavior.Log(a, p, row)
	}
}

// NewPoliceAgent creates a police agent.
func NewPoliceAgent(id uint64) *Agent {
	return &Agent{
		ID:        id,
		Kind:      PoliceAgentKind,
		Behaviors: []Behavior{&PoliceBehavior{}},
	}
}
