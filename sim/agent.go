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

// An Agent is an entity that can move and perform actions during a simulation.
type Agent interface {
	// Init is run once when the simulation starts.
	Init(p *Provider)

	// DayStart is run on the first tick of each simulation day.
	DayStart(p *Provider)

	// Move is run in the first phase of every tick in agent ID order.
	Move(p *Provider)

	// Action is run in the second phase of every tick in random order.
	Action(p *Provider)

	// Log collects data about the agent at the end of every tick.
	Log(p *Provider, row *AgentDataRow)

	setLocation(node *Node, el *list.Element)
	getLocation() (*Node, *list.Element)
}

type baseAgent struct {
	ID uint64

	Location *Node

	locationElement *list.Element
}

// Init is run once when the simulation starts.
func (agent *baseAgent) Init(p *Provider) {}

// DayStart is run on the first tick of each simulation day.
func (agent *baseAgent) DayStart(p *Provider) {}

// Move is run in the first phase of every tick in agent ID order.
func (agent *baseAgent) Move(p *Provider) {}

// Action is run in the second phase of every tick in random order.
func (agent *baseAgent) Action(p *Provider) {}

// Log collects data about the agent at the end of every tick.
func (agent *baseAgent) Log(p *Provider, row *AgentDataRow) {
	row.ID = agent.ID

	row.LocationID = agent.Location.ID
	row.X = agent.Location.X
	row.Y = agent.Location.Y
}

func (agent *baseAgent) String() string {
	return fmt.Sprintf("A%d", agent.ID)
}

func (agent *baseAgent) setLocation(node *Node, el *list.Element) {
	agent.Location = node
	agent.locationElement = el
}

func (agent *baseAgent) getLocation() (*Node, *list.Element) {
	return agent.Location, agent.locationElement
}
