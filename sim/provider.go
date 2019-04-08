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

	openFiles   []*os.File
	openBuffers map[string]*bufio.Writer

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
		Name:        name,
		BaseDir:     outputBase,
		Config:      cfg,
		openBuffers: make(map[string]*bufio.Writer),
	}
}

// Close releases any resources used by this provider.
func (p *Provider) Close() {
	for _, w := range p.openBuffers {
		if err := w.Flush(); err != nil {
			p.Logger().Println("failed to flush file:", err)
		}
	}

	for _, f := range p.openFiles {
		f.Close()
	}

	p.openBuffers = make(map[string]*bufio.Writer)
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
	return p.makeWriter("agents.csv")
}

// NodeDataWriter returns the CSV file for writing intersection data.
func (p *Provider) NodeDataWriter() *bufio.Writer {
	return p.makeWriter("intersections.csv")
}

// AggregateAgentDataWriter returns the CSV file for writing agent aggregate data.
func (p *Provider) AggregateAgentDataWriter() *bufio.Writer {
	return p.makeWriter("aggregate-agents.csv")
}

// AggregateNodeDataWriter returns the CSV file for writing agent aggregate data.
func (p *Provider) AggregateNodeDataWriter() *bufio.Writer {
	return p.makeWriter("aggregate-intersections.csv")
}

// TimestepDataWriter returns the CSV file for writing timestep data.
func (p *Provider) TimestepDataWriter() *bufio.Writer {
	return p.makeWriter("timesteps.csv")
}

// OutcomesDataWriter returns the CSV file for writing outcomes data.
func (p *Provider) OutcomesDataWriter() *bufio.Writer {
	return p.makeWriter("outcomes.csv")
}

func (p *Provider) makeWriter(name string) *bufio.Writer {
	w, ok := p.openBuffers[name]
	if !ok {
		f, err := p.Files().CreateFile(name)
		if err != nil {
			panic(fmt.Errorf("failed to create file: %s", name))
		}

		w = bufio.NewWriter(f)

		p.openFiles = append(p.openFiles, f)
		p.openBuffers[name] = w
	}

	return w
}
