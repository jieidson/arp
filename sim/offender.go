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

// Log collects data about the agent at the end of every tick.
func (agent *OffenderAgent) Log(p *Provider, row *AgentDataRow) {
	agent.CivilianAgent.Log(p, row)

	row.Kind = uint64(OffenderAgentKind)
}
