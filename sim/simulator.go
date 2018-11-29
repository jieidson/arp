package sim

import (
	"fmt"
	"github.com/jieidson/arp/config"
)

// Simulator holds the agents in a simulation.
type Simulator struct {
	Provider *Provider
	Agents   []Agent

	CurrentTick uint64
}

// NewSimulator instantiates all of the agents in a simulation.
func NewSimulator(p *Provider) *Simulator {
	c := p.Config
	totalAgents := c.Agent.Civilian + c.Agent.Offender + c.Agent.Police

	sim := &Simulator{
		Provider: p,
		Agents:   make([]Agent, 0, totalAgents),
	}

	sim.generateAgents(c)

	for _, agent := range sim.Agents {
		agent.Init(p)
	}

	return sim
}

// Loop runs the simulation loop for the configured number of ticks.
func (s *Simulator) Loop() error {
	time := s.Provider.Config.Time
	totalTicks := time.TicksPerDay * time.TotalDays

	if err := WriteAgentDataHeader(s.Provider.AgentDataWriter()); err != nil {
		return fmt.Errorf("failed to write agent data header: %v", err)
	}

	if err := WriteNodeDataHeader(s.Provider.NodeDataWriter()); err != nil {
		return fmt.Errorf("failed to write intersection data header: %v", err)
	}

	step := totalTicks / 100
	percent := 0

	for s.CurrentTick = 0; s.CurrentTick < totalTicks; s.CurrentTick++ {
		if err := s.tick(); err != nil {
			return fmt.Errorf("failed to run tick: %v", err)
		}

		if s.CurrentTick%step == 0 {
			s.Provider.Logger().Printf("%d%% complete (tick %d of %d)", percent, s.CurrentTick, totalTicks)
			percent++
		}
	}

	return nil
}

// tick executes a single tick of the simulation.
func (s *Simulator) tick() error {
	// Check if it's the first tick of a new day.
	if s.CurrentTick%s.Provider.Config.Time.TicksPerDay == 0 {
		s.dayStartPhase()
	}

	s.movementPhase()
	s.actionPhase()

	if err := s.logAgents(); err != nil {
		return err
	}

	if err := s.logNodes(); err != nil {
		return err
	}

	return nil
}

func (s *Simulator) generateAgents(c config.Config) {
	var id uint64
	nextID := func() uint64 {
		i := id
		id++
		return i
	}

	// Generate police agents
	for i := uint64(0); i < c.Agent.Police; i++ {
		s.Agents = append(s.Agents, NewPoliceAgent(nextID()))
	}

	// Keep a temporary separate list of just civilian and offender agents, so we
	// can mark them as employed or not in a bit.
	workforce := make([]*CivilianAgent, 0, c.Agent.Civilian+c.Agent.Offender)

	// Generate civilian agents
	for i := uint64(0); i < c.Agent.Civilian; i++ {
		agent := NewCivilianAgent(uint64(len(s.Agents)))

		s.Agents = append(s.Agents, agent)
		workforce = append(workforce, agent)
	}

	// Generate offender agents
	for i := uint64(0); i < c.Agent.Offender; i++ {
		agent := NewOffenderAgent(uint64(len(s.Agents)))

		s.Agents = append(s.Agents, agent)
		workforce = append(workforce, &agent.CivilianAgent)
	}

	s.determineEmployment(workforce)
}

func (s *Simulator) determineEmployment(workforce []*CivilianAgent) {
	// First, mark everyone as employed
	for _, agent := range workforce {
		agent.Employed = true
	}

	// Figure out how many unemployed there should be.
	unemploymentRate := float64(s.Provider.Config.Economy.Unemployment) / 100.0
	// This conversion rounds towards zero.
	unemployedCount := int(float64(len(workforce)) * unemploymentRate)

	// Mark those agents as unemployed.
	for _, i := range s.Provider.RNG().PermN(len(workforce), unemployedCount) {
		workforce[i].Employed = false
	}
}

func (s *Simulator) dayStartPhase() {
	for _, agent := range s.Agents {
		agent.DayStart(s.Provider)
	}
}

func (s *Simulator) movementPhase() {
	for _, agent := range s.Agents {
		agent.Move(s.Provider)
	}
}

func (s *Simulator) actionPhase() {
	// Agents perform actions in random order, to ensure the same agent doesn't
	// always get to do an action before others.
	for _, i := range s.Provider.RNG().Perm(len(s.Agents)) {
		s.Agents[i].Action(s.Provider)
	}
}

func (s *Simulator) logAgents() error {
	writer := s.Provider.AgentDataWriter()

	var row AgentDataRow
	row.Timestep = s.CurrentTick

	for _, agent := range s.Agents {
		agent.Log(s.Provider, &row)

		if err := row.Write(writer); err != nil {
			return fmt.Errorf("failed to write agent data: %v", err)
		}
	}

	return nil
}

func (s *Simulator) logNodes() error {
	writer := s.Provider.NodeDataWriter()

	var row NodeDataRow
	row.Timestep = s.CurrentTick

	for _, node := range s.Provider.Arena().Nodes {
		node.Log(s.Provider, &row)

		if err := row.Write(writer); err != nil {
			return fmt.Errorf("failed to write node data: %v", err)
		}
	}

	return nil
}
