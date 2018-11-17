package provider

import (
	"github.com/jieidson/arp/arena"
	"github.com/jieidson/arp/config"
	"github.com/jieidson/arp/rng"
)

// Provider provides access to various parts of the simulation
type Provider struct {
	config config.Config

	arena *arena.Arena
	rng   *rng.RNG
}

// New creates a new instance of the provider.
func New(c config.Config) *Provider {
	return &Provider{config: c}
}

// Arena returns the simulation arena.
func (p *Provider) Arena() *arena.Arena {
	if p.arena == nil {
		p.arena = arena.MajorStreetsGrid(p.config.Arena, p.RNG())
	}

	return p.arena
}

// RNG returns the random number generator.
func (p *Provider) RNG() *rng.RNG {
	if p.rng == nil {
		p.rng = rng.New(p.config.RNG.Seed)
	}

	return p.rng
}
