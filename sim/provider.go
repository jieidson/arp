package sim

import (
	"encoding/csv"
	"fmt"
	"log"
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
	logger    *log.Logger
	navigator *Navigator
	rng       *RNG
	simulator *Simulator

	agentDataWriter *csv.Writer
	nodeDataWriter  *csv.Writer
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
	for _, f := range p.openFiles {
		f.Close()
	}

	p.openFiles = []*os.File{}
}

// Arena returns the simulation arena.
func (p *Provider) Arena() *Arena {
	if p.arena == nil {
		p.Logger().Println("generating grid")
		p.arena = MajorStreetsGrid(p.Config.Arena, p.RNG())
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
func (p *Provider) Logger() *log.Logger {
	if p.logger == nil {
		logFile, err := p.Files().CreateFile("log.txt")
		if err != nil {
			panic(fmt.Errorf("failed to create log file: %v", err))
		}

		p.openFiles = append(p.openFiles, logFile)
		p.logger = log.New(logFile, "", log.Ldate|log.Ltime)
	}

	return p.logger
}

// Navigator returns the navigator for the arena.
func (p *Provider) Navigator() *Navigator {
	if p.navigator == nil {
		p.Logger().Println("generating navigation")
		p.navigator = NewNavigator(p.Arena())
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
func (p *Provider) AgentDataWriter() *csv.Writer {
	if p.agentDataWriter == nil {
		csvFile, err := p.Files().CreateFile("agents.csv")
		if err != nil {
			panic(fmt.Errorf("failed to create agent data file: %v", err))
		}

		p.openFiles = append(p.openFiles, csvFile)
		p.agentDataWriter = csv.NewWriter(csvFile)
	}

	return p.agentDataWriter
}

// NodeDataWriter returns the CSV file for writing intersection data.
func (p *Provider) NodeDataWriter() *csv.Writer {
	if p.nodeDataWriter == nil {
		csvFile, err := p.Files().CreateFile("intersections.csv")
		if err != nil {
			panic(fmt.Errorf("failed to create intersection data file: %v", err))
		}

		p.openFiles = append(p.openFiles, csvFile)
		p.nodeDataWriter = csv.NewWriter(csvFile)
	}

	return p.nodeDataWriter
}
