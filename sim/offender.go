package sim

// OffenderState describes how far an offender got in their process.
type OffenderState int

// The possible kinds of agents.
const (
	NotOffenderState OffenderState = iota
	EvaluatedTargetsOffenderState
	FoundTargetsOffenderState
	ChoseTargetOffenderState
	RobbedOffenderState
)

// String returns a string representation of offender state.
func (s OffenderState) String() string {
	switch s {
	case NotOffenderState:
		return "not"
	case EvaluatedTargetsOffenderState:
		return "evaluated-targets"
	case FoundTargetsOffenderState:
		return "found-targets"
	case ChoseTargetOffenderState:
		return "chose-targets"
	case RobbedOffenderState:
		return "robbed"
	}
	panic("unexpected agent kind")
}

// NewOffenderAgent creates a new Offender agent.
func NewOffenderAgent(id uint64) *Agent {
	return &Agent{
		ID:   id,
		Kind: OffenderAgentKind,
		Behavior: []Behavior{
			&CivilianBehavior{},
			&OffenderBehavior{},
			&OffenderModel1Behavior{},
		},
	}
}

// OffenderBehavior implements offender agent behavior.
type OffenderBehavior struct {
	baseBehavior

	Cooldown uint64

	// These is kept just to log it later.

	State OffenderState

	TargetID     uint64
	Guardianship int64
	Suitability  int64
}

// Move is run in the first phase of every tick in agent ID order.
func (offender *OffenderBehavior) Move(p *Provider, agent *Agent) {
	offender.State = NotOffenderState

	if offender.Cooldown > 0 {
		offender.Cooldown--
	}
}

// Log collects data about the agent at the end of every tick.
func (offender *OffenderBehavior) Log(p *Provider, agent *Agent, row *AgentDataRow) {
	row.State = uint64(offender.State)

	row.TargetID = offender.TargetID
	row.Guardianship = offender.Guardianship
	row.Suitability = offender.Suitability
}
