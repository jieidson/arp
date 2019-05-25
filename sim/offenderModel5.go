package sim

// OffenderModel5Behavior implements offender agent behavior for sub-model 5.
type OffenderModel5Behavior struct{ OffenderModel4Behavior }

// Action is run in the second phase of every tick in random order.
func (model5 *OffenderModel5Behavior) Action(p *Provider, agent *Agent) {
	switch agent.Kind {
	case CivilianAgentKind:
		if agent.Location.Morals == LowMoralContext {
			// Civilian at a low moral context node performs steps 2 through 12.
			model5.OffenderModel4Behavior.OffenderModel1Behavior.Action(p, agent)
		}

	case OffenderAgentKind:
		switch agent.Location.Morals {
		case HighMoralContext:
			// Offender at a high moral context node performs steps 2 through 12.
			model5.OffenderModel4Behavior.OffenderModel1Behavior.Action(p, agent)

		case LowMoralContext:
			// Offender at a low moral context node performs steps 2 through 12 except
			// it does not evaluate guardianship (steps 4, 5, 11 and 12). Offender will
			// rob a suitable target.
			model5.OffenderModel4Behavior.actionWithoutGuardianship(p, agent)
		}

	default:
		panic("agent not a civilian or offender?")
	}
}
