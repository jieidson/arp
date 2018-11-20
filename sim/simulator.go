package sim

import (
	"fmt"
	"github.com/jieidson/arp/config"
)

// Simulator holds the agents in a simulation.
type Simulator struct {
	Provider *Provider
	Agents   []*Agent

	CurrentTick uint64
}

// NewSimulator instantiates all of the agents in a simulation.
func NewSimulator(p *Provider) *Simulator {
	c := p.Config
	totalAgents := c.Agent.Civilian + c.Agent.Offender + c.Agent.Police

	sim := &Simulator{
		Provider: p,
		Agents:   make([]*Agent, 0, totalAgents),
	}

	sim.generatePolice(c)
	sim.generateCivilians(c)
	sim.generateOffenders(c)

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

	for s.CurrentTick = 0; s.CurrentTick < totalTicks; s.CurrentTick++ {
		if err := s.Tick(); err != nil {
			return fmt.Errorf("failed to run tick: %v", err)
		}
	}

	return nil
}

// Tick executes a single tick of the simulation.
func (s *Simulator) Tick() error {
	for _, agent := range s.Agents {
		agent.Move(s.Provider)
	}

	for _, agent := range s.Agents {
		agent.Action(s.Provider)
	}

	for _, agent := range s.Agents {
		data := agent.Log(s.Provider)
		data[ColumnAgentTimestep] = s.CurrentTick

		if err := data.Write(s.Provider.AgentDataWriter()); err != nil {
			return fmt.Errorf("failed to write agent data: %v", err)
		}
	}

	for _, node := range s.Provider.Arena().Nodes {
		data := node.Log(s.Provider)
		data[ColumnNodeTimestep] = s.CurrentTick

		if err := data.Write(s.Provider.NodeDataWriter()); err != nil {
			return fmt.Errorf("failed to write node data: %v", err)
		}
	}

	return nil
}

func (s *Simulator) generatePolice(c config.Config) {
	for i := uint64(0); i < c.Agent.Police; i++ {
		s.Agents = append(s.Agents, NewPoliceAgent(uint64(len(s.Agents))))
	}
}

func (s *Simulator) generateCivilians(c config.Config) {
	for i := uint64(0); i < c.Agent.Civilian; i++ {
		s.Agents = append(s.Agents, NewPoliceAgent(uint64(len(s.Agents))))
	}
}

func (s *Simulator) generateOffenders(c config.Config) {
	for i := uint64(0); i < c.Agent.Offender; i++ {
		s.Agents = append(s.Agents, NewPoliceAgent(uint64(len(s.Agents))))
	}
}
