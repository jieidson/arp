package sim

// OffenderModel1Behavior implements offender agent behavior for sub-model 1.
type OffenderModel1Behavior struct{ baseBehavior }

// Action is run in the second phase of every tick in random order.
func (model1 *OffenderModel1Behavior) Action(p *Provider, agent *Agent) {
	civilian, _ := agent.Civilian()
	if !civilian.IsActive {
		return
	}

	offender, _ := agent.Offender()

	if offender.Cooldown > 0 {
		return
	}

	offender.State = EvaluatedTargetsOffenderState

	targets := model1.gatherTargets(agent)
	if len(targets) == 0 {
		return
	}

	offender.State = FoundTargetsOffenderState

	offender.Guardianship = model1.calculateGuardianship(p, agent)
	if offender.Guardianship > 1 {
		return
	}

	target := model1.chooseTarget(targets)
	if target == nil {
		// Wealthiest target has no money.
		return
	}

	offender.State = ChoseTargetOffenderState

	offender.TargetID = target.ID

	offender.Suitability = model1.calculateSuitability(p, agent, target)
	if offender.Suitability < 0 {
		return
	}

	if offender.Guardianship < 1 || p.RNG().Bool() {
		model1.rob(p, agent, target)
	}
}

func (model1 *OffenderModel1Behavior) gatherTargets(agent *Agent) []*Agent {
	var targets []*Agent

	for el := agent.Location.Agents.Front(); el != nil; el = el.Next() {
		target := el.Value.(*Agent)

		if _, ok := target.Police(); ok {
			return nil
		}

		if offender, ok := target.Offender(); ok && offender.State == RobbedOffenderState {
			return nil
		}

		if agent == target {
			continue
		}

		if civilian, ok := target.Civilian(); ok && !civilian.IsActive {
			continue
		}

		targets = append(targets, target)
	}

	return targets
}

func (model1 *OffenderModel1Behavior) calculateGuardianship(p *Provider, agent *Agent) int64 {
	var activeAgents int64

	for el := agent.Location.Agents.Front(); el != nil; el = el.Next() {
		guardian := el.Value.(*Agent)
		if civilian, ok := guardian.Civilian(); ok && !civilian.IsActive {
			continue
		}
		activeAgents++
	}

	perception := p.RNG().Int64(-2, 2)

	return (activeAgents - 2) + perception
}

func (model1 *OffenderModel1Behavior) chooseTarget(targets []*Agent) *Agent {
	var maxWealth int64
	var wealthiest *Agent

	for _, target := range targets {
		civilian, ok := target.Civilian()
		if !ok {
			panic("a non-civilian was chosen as a target somehow")
		}

		if civilian.Wealth > maxWealth {
			maxWealth = civilian.Wealth
			wealthiest = target
		}
	}

	return wealthiest
}

func (model1 *OffenderModel1Behavior) calculateSuitability(p *Provider, agent, target *Agent) int64 {
	civilianOffender, ok := agent.Civilian()
	if !ok {
		panic("offender is not a civilian")
	}

	civilianTarget, ok := target.Civilian()
	if !ok {
		panic("cannot calculate suitability of a non-civilian")
	}

	perception := p.RNG().Int64(-1, 1)

	return int64(civilianTarget.Wealth) - int64(civilianOffender.Wealth) + perception
}

func (model1 *OffenderModel1Behavior) rob(p *Provider, agent, target *Agent) {
	amount := int64(p.Config.Offender.Amount)

	civilianOffender, ok := agent.Civilian()
	if !ok {
		panic("offender is not a civilian")
	}

	civilianTarget, ok := target.Civilian()
	if !ok {
		panic("cannot calculate suitability of a non-civilian")
	}

	civilianTarget.Wealth -= amount
	if civilianTarget.Wealth < 0 {
		amount = amount + civilianTarget.Wealth
		civilianTarget.Wealth = 0
	}

	civilianOffender.Wealth += amount

	offender, ok := agent.Offender()
	if !ok {
		panic("not really an offender")
	}

	offender.State = RobbedOffenderState
	offender.Cooldown = p.Config.Offender.Cooldown

	target.TotalVictimized++
	agent.TotalOffended++
	agent.Location.TotalRobberies++
}
