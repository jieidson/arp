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

	Offended bool
	Cooldown uint64
}

// Move is run in the first phase of every tick in agent ID order.
func (agent *OffenderAgent) Move(p *Provider) {
	agent.CivilianAgent.Move(p)

	if agent.Cooldown > 0 {
		agent.Cooldown--
	}
}

// Action is run in the second phase of every tick in random order.
func (agent *OffenderAgent) Action(p *Provider) {
	agent.CivilianAgent.Action(p)

	if !agent.IsActive {
		return
	}

	agent.gatherTargets()
}

// Log collects data about the agent at the end of every tick.
func (agent *OffenderAgent) Log(p *Provider, row *AgentDataRow) {
	agent.CivilianAgent.Log(p, row)

	row.Kind = uint64(OffenderAgentKind)
}

func (agent *OffenderAgent) gatherTargets() []Agent {
	var targets []Agent

	for el := agent.Location.Agents.Front(); el != nil; el = el.Next() {
		target := el.Value.(Agent)

		if agent == target {
			continue
		}

		if _, ok := target.(*PoliceAgent); ok {
			return nil
		}

		if offender, ok := target.(*OffenderAgent); ok && offender.Offended {
			return nil
		}

		if base := target.(*CivilianAgent); !base.IsActive {
			continue
		}

		targets = append(targets, target)
	}

	return targets
}
