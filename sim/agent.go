package sim

import (
	"container/list"
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

	// Move is run in the first phase of every tick in agent ID order.
	Move(p *Provider)

	// Action is run in the second phase of every tick in random order.
	Action(p *Provider)

	// Log collects data about the agent at the end of every tick.
	Log(p *Provider, row *AgentDataRow)
}

type baseAgent struct {
	ID uint64

	Location *Node

	locationElement *list.Element
}

// Init is run once when the simulation starts.
func (agent *baseAgent) Init(p *Provider) {}

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

func (agent *baseAgent) enter(node *Node) {
	agent.locationElement = node.Agents.PushBack(agent)
	agent.Location = node
}

func (agent *baseAgent) leave(node *Node) {
	node.Agents.Remove(agent.locationElement)
	agent.locationElement = nil
	agent.Location = nil
}

// follow moves an agent across an edge, returning the destination node.
func (agent *baseAgent) follow(edge *Edge) *Node {
	if agent.Location == edge.A {
		agent.leave(edge.A)
		agent.enter(edge.B)
		return edge.B
	}

	if agent.Location == edge.B {
		agent.leave(edge.B)
		agent.enter(edge.A)
		return edge.A
	}

	panic("tried to move agent through non-adjacent edge")
}
