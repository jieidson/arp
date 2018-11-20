package arp

import (
	"fmt"
	"log"
	"os"

	"github.com/jieidson/arp/config"
	"github.com/jieidson/arp/sim"
)

// Provider provides access to various parts of the simulation
type Provider struct {
	Name    string
	BaseDir string
	Config  config.Config

	logFile *os.File

	files  *sim.Files
	logger *log.Logger
	arena  *sim.Arena
	rng    *sim.RNG
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
	if p.logFile != nil {
		p.logFile.Close()
		p.logFile = nil
	}
}

// Files returns the file manager.
func (p *Provider) Files() *sim.Files {
	if p.files == nil {
		var err error
		p.files, err = sim.NewFiles(p.BaseDir, p.Name)
		if err != nil {
			panic(fmt.Errorf("failed to create file manager: %v", err))
		}
	}

	return p.files
}

// Logger returns the logger for this simulator.
func (p *Provider) Logger() *log.Logger {
	if p.logger == nil {
		logFile, err := p.files.CreateFile("log.txt")
		if err != nil {
			panic(fmt.Errorf("failed to create log file: %v", err))
		}

		p.logger = log.New(logFile, "", log.Ldate|log.Ltime)
	}

	return p.logger
}

// Arena returns the simulation arena.
func (p *Provider) Arena() *sim.Arena {
	if p.arena == nil {
		p.Logger().Println("generating grid")
		p.arena = sim.MajorStreetsGrid(p.Config.Arena, p.RNG())
	}

	return p.arena
}

// RNG returns the random number generator.
func (p *Provider) RNG() *sim.RNG {
	if p.rng == nil {
		p.rng = sim.NewRNG(p.Config.RNG.Seed)
	}

	return p.rng
}
