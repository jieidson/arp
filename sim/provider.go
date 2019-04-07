package sim

import (
	"bufio"
	"fmt"
	"os"

	"github.com/jieidson/arp/config"
)

// Provider provides access to various parts of the simulation
type Provider struct {
	Name    string
	BaseDir string
	Config  config.Config

	openFiles []*os.File

	arena     *Arena
	files     *Files
	logger    *Logger
	navigator *Navigator
	rng       *RNG
	simulator *Simulator

	agentDataWriter *bufio.Writer
	nodeDataWriter  *bufio.Writer

	agentAggregateDataWriter *bufio.Writer
	nodeAggregateDataWriter  *bufio.Writer
}

// NewProvider creates a new service provider.
func NewProvider(name, outputBase string, cfg config.Config) *Provider {
	return &Provider{
		Name:    name,
		BaseDir: outputBase,
		Config:  cfg,
	}
}

// Close releases any resources used by this provider.
func (p *Provider) Close() {
	if p.agentDataWriter != nil {
		if err := p.agentDataWriter.Flush(); err != nil {
			p.Logger().Println("failed to flush agent data writer:", err)
		}
	}
	if p.nodeDataWriter != nil {
		if err := p.nodeDataWriter.Flush(); err != nil {
			p.Logger().Println("failed to flush node data writer:", err)
		}
	}
	if p.agentAggregateDataWriter != nil {
		if err := p.agentAggregateDataWriter.Flush(); err != nil {
			p.Logger().Println("failed to flush aggregate agent data writer:", err)
		}
	}
	if p.nodeAggregateDataWriter != nil {
		if err := p.nodeAggregateDataWriter.Flush(); err != nil {
			p.Logger().Println("failed to flush aggregate node data writer:", err)
		}
	}

	for _, f := range p.openFiles {
		f.Close()
	}

	p.openFiles = []*os.File{}
}

// Arena returns the simulation arena.
func (p *Provider) Arena() *Arena {
	if p.arena == nil {
		p.Logger().Println("generating grid")
		p.arena = MoralContextArena(p.Config, p.RNG())
	}

	return p.arena
}

// Files returns the file manager.
func (p *Provider) Files() *Files {
	if p.files == nil {
		var err error
		p.files, err = NewFiles(p.BaseDir, p.Name)
		if err != nil {
			panic(fmt.Errorf("failed to create file manager: %v", err))
		}
	}

	return p.files
}

// Logger returns the logger for this simulator.
func (p *Provider) Logger() *Logger {
	if p.logger == nil {
		logFile, err := p.Files().CreateFile("log.txt")
		if err != nil {
			panic(fmt.Errorf("failed to create log file: %v", err))
		}

		p.openFiles = append(p.openFiles, logFile)
		p.logger = NewLogger(logFile)
	}

	return p.logger
}

// Navigator returns the navigator for the arena.
func (p *Provider) Navigator() *Navigator {
	if p.navigator == nil {
		p.Logger().Println("generating navigation")
		p.navigator = NewNavigator(p)
	}
	return p.navigator
}

// RNG returns the random number generator.
func (p *Provider) RNG() *RNG {
	if p.rng == nil {
		p.Logger().Println("instantiating random number generator")
		p.rng = NewRNG(p.Config.RNG.Seed)
	}

	return p.rng
}

// Simulator returns the collection of agents.
func (p *Provider) Simulator() *Simulator {
	if p.simulator == nil {
		p.Logger().Println("instantiating agents")
		p.simulator = NewSimulator(p)
	}

	return p.simulator
}

// AgentDataWriter returns the CSV file for writing agent data.
func (p *Provider) AgentDataWriter() *bufio.Writer {
	if p.agentDataWriter == nil {
		dataFile, err := p.Files().CreateFile("agents.csv")
		if err != nil {
			panic(fmt.Errorf("failed to create agent data file: %v", err))
		}

		p.openFiles = append(p.openFiles, dataFile)
		p.agentDataWriter = bufio.NewWriter(dataFile)
	}

	return p.agentDataWriter
}

// NodeDataWriter returns the CSV file for writing intersection data.
func (p *Provider) NodeDataWriter() *bufio.Writer {
	if p.nodeDataWriter == nil {
		dataFile, err := p.Files().CreateFile("intersections.csv")
		if err != nil {
			panic(fmt.Errorf("failed to create intersection data file: %v", err))
		}

		p.openFiles = append(p.openFiles, dataFile)
		p.nodeDataWriter = bufio.NewWriter(dataFile)
	}

	return p.nodeDataWriter
}

// AgentAggregateDataWriter returns the CSV file for writing agent aggregate data.
func (p *Provider) AggregateAgentDataWriter() *bufio.Writer {
	if p.agentAggregateDataWriter == nil {
		dataFile, err := p.Files().CreateFile("aggregate-agents.csv")
		if err != nil {
			panic(fmt.Errorf("failed to create agent data file: %v", err))
		}

		p.openFiles = append(p.openFiles, dataFile)
		p.agentAggregateDataWriter = bufio.NewWriter(dataFile)
	}

	return p.agentAggregateDataWriter
}

// NodeAggregateDataWriter returns the CSV file for writing agent aggregate data.
func (p *Provider) AggregateNodeDataWriter() *bufio.Writer {
	if p.nodeAggregateDataWriter == nil {
		dataFile, err := p.Files().CreateFile("aggregate-intersections.csv")
		if err != nil {
			panic(fmt.Errorf("failed to create agent data file: %v", err))
		}

		p.openFiles = append(p.openFiles, dataFile)
		p.nodeAggregateDataWriter = bufio.NewWriter(dataFile)
	}

	return p.nodeAggregateDataWriter
}
