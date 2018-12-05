package sim

import (
	"io/ioutil"
	"testing"

	"github.com/jieidson/arp/config"
)

const gridSize = 25

func BenchmarkFloydWarshall(b *testing.B) {
	p := Provider{
		arena: GridArena(config.ArenaConfig{
			Width:  gridSize,
			Height: gridSize,
		}),
		logger: NewLogger(ioutil.Discard),
	}

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		navigator := NewNavigator(&p)
		floydWarshall(navigator, &p)
	}
}

func BenchmarkFloydWarshall2(b *testing.B) {
	p := Provider{
		arena: GridArena(config.ArenaConfig{
			Width:  gridSize,
			Height: gridSize,
		}),
		logger: NewLogger(ioutil.Discard),
	}

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		navigator := NewNavigator(&p)
		floydWarshall2(navigator, &p)
	}
}
