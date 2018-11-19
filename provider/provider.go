package provider

import (
	"fmt"

	"github.com/jieidson/arp/arena"
	"github.com/jieidson/arp/config"
	"github.com/jieidson/arp/rng"
)

// Provider provides access to various parts of the simulation
type Provider struct {
	Name    string
	BaseDir string
	Config  config.Config

	files *Files
	arena *arena.Arena
	rng   *rng.RNG
}

// New creates a new instance of the provider.
func New(name, baseDir string, c config.Config) *Provider {
	return &Provider{Name: name, BaseDir: baseDir, Config: c}
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

// Arena returns the simulation arena.
func (p *Provider) Arena() *arena.Arena {
	if p.arena == nil {
		p.arena = arena.MajorStreetsGrid(p.Config.Arena, p.RNG())
	}

	return p.arena
}

// RNG returns the random number generator.
func (p *Provider) RNG() *rng.RNG {
	if p.rng == nil {
		p.rng = rng.New(p.Config.RNG.Seed)
	}

	return p.rng
}
