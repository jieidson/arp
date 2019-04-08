package sim

// OffenderModel2Behavior implements offender agent behavior for sub-model 2.
type OffenderModel2Behavior struct{ OffenderModel1Behavior }

// Action is run in the second phase of every tick in random order.
func (model2 *OffenderModel2Behavior) Action(p *Provider, agent *Agent) {
	if agent.Location.Morals != LowMoralContext {
		return
	}

	model2.OffenderModel1Behavior.Action(p, agent)
}
