package sim

// NewOffenderAgent creates a new Offender agent.
func NewOffenderAgent(id uint64) *OffenderAgent {
	return &OffenderAgent{
		CivilianAgent: CivilianAgent{
			baseAgent: baseAgent{ID: id},
		},
	}
}

// OffenderAgent implements offender agent behavior.
type OffenderAgent struct {
	// An offender inherits all the behavior of a civilian agent.
	CivilianAgent
}
