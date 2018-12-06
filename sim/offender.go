package sim

// NewOffenderAgent creates a new Offender agent.
func NewOffenderAgent(id uint64) *Agent {
	return &Agent{
		ID:   id,
		Kind: OffenderAgentKind,
		Behavior: []Behavior{
			&CivilianBehavior{},
			&OffenderBehavior{},
		},
	}
}

// OffenderBehavior implements offender agent behavior.
type OffenderBehavior struct {
	Offended bool
	Cooldown uint64
}

// Init is run once when the simulation starts.
func (offender *OffenderBehavior) Init(p *Provider, agent *Agent) {}

// DayStart is run on the first tick of each simulation day.
func (offender *OffenderBehavior) DayStart(p *Provider, agent *Agent) {}

// Move is run in the first phase of every tick in agent ID order.
func (offender *OffenderBehavior) Move(p *Provider, agent *Agent) {
	if offender.Cooldown > 0 {
		offender.Cooldown--
	}
}

// Action is run in the second phase of every tick in random order.
func (offender *OffenderBehavior) Action(p *Provider, agent *Agent) {
	civilian, _ := agent.Civilian()
	if !civilian.IsActive {
		return
	}

	offender.gatherTargets(agent)
}

// Log collects data about the agent at the end of every tick.
func (offender *OffenderBehavior) Log(p *Provider, agent *Agent, row *AgentDataRow) {}

func (offender *OffenderBehavior) gatherTargets(agent *Agent) []*Agent {
	var targets []*Agent

	for el := agent.Location.Agents.Front(); el != nil; el = el.Next() {
		target := el.Value.(*Agent)

		if agent == target {
			continue
		}

		if _, ok := target.Police(); ok {
			return nil
		}

		if offender, ok := target.Offender(); ok && offender.Offended {
			return nil
		}

		if civilian, ok := target.Civilian(); ok && !civilian.IsActive {
			continue
		}

		targets = append(targets, target)
	}

	return targets
}
