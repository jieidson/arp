package sim

// OffenderModel4Behavior implements offender agent behavior for sub-model 4.
type OffenderModel4Behavior struct{ OffenderModel1Behavior }

// Action is run in the second phase of every tick in random order.
func (model4 *OffenderModel4Behavior) Action(p *Provider, agent *Agent) {
	switch agent.Location.Morals {
	case HighMoralContext:
		// Offender at a high moral context node performs steps 2 through 12.
		model4.OffenderModel1Behavior.Action(p, agent)

	case LowMoralContext:
		// Offender at a low moral context node performs steps 2 through 12 except
		// it does not evaluate guardianship (steps 4, 5, 11 and 12). Offender will
		// rob a suitable target.
		model4.actionWithoutGuardianship(p, agent)
	}

}

func (model4 *OffenderModel4Behavior) actionWithoutGuardianship(p *Provider, agent *Agent) {
	civilian, _ := agent.Civilian()
	if !civilian.IsActive {
		return
	}

	offender, _ := agent.Offender()

	if offender.Cooldown > 0 {
		return
	}

	offender.State = EvaluatedTargetsOffenderState

	targets := model4.OffenderModel1Behavior.gatherTargets(agent)
	if len(targets) == 0 {
		return
	}

	offender.State = FoundTargetsOffenderState

	target := model4.OffenderModel1Behavior.chooseTarget(targets)
	if target == nil {
		// Wealthiest target has no money.
		return
	}

	offender.State = ChoseTargetOffenderState

	offender.TargetID = target.ID

	offender.Suitability = model4.OffenderModel1Behavior.calculateSuitability(p, agent, target)
	if offender.Suitability < 0 {
		return
	}

	model4.OffenderModel1Behavior.rob(p, agent, target)
}
