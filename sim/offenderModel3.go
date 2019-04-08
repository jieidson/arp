package sim

// OffenderModel3Behavior implements offender agent behavior for sub-model 3.
type OffenderModel3Behavior struct{ OffenderModel1Behavior }

// Action is run in the second phase of every tick in random order.
func (model3 *OffenderModel3Behavior) Action(p *Provider, agent *Agent) {
	if agent.Location.Morals != HighMoralContext {
		return
	}

	model3.OffenderModel1Behavior.Action(p, agent)
}
