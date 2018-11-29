package sim

import (
	"testing"

	"github.com/jieidson/arp/config"
)

const gridSize = 25

func BenchmarkFloydWarshall(b *testing.B) {
	arena := GridArena(config.ArenaConfig{
		Width:  gridSize,
		Height: gridSize,
	})

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		navigator := NewNavigator(arena)
		floydWarshall(navigator)
	}
}

func BenchmarkFloydWarshall2(b *testing.B) {
	arena := GridArena(config.ArenaConfig{
		Width:  gridSize,
		Height: gridSize,
	})

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		navigator := NewNavigator(arena)
		floydWarshall2(navigator)
	}
}
