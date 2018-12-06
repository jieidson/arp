package sim

import (
	"math"
	"math/rand"

	"github.com/seehuhn/mt19937"
)

// RNG is a pseudo-random number generator backed by a Mersenne Twister
// algorithm.
type RNG rand.Rand

// NewRNG creates a new instance of the RNG.
func NewRNG(seed int64) *RNG {
	rng := rand.New(mt19937.New())
	rng.Seed(seed)

	return (*RNG)(rng)
}

// Int64 returns a random int64 between [min, max), inclusive of min, exclusive
// of max.
func (r *RNG) Int64(min, max int64) int64 {
	rng := (*rand.Rand)(r)
	return rng.Int63n(max-min) + min
}

// Uint64 returns a random uint64 between [min, max), inclusive of min,
// exclusive of max.
func (r *RNG) Uint64(min, max uint64) uint64 {
	rng := (*rand.Rand)(r)

	x := max - min

	if x < math.MaxInt64 {
		return uint64(rand.Int63n(int64(x+1))) + min
	}

	y := rng.Uint64()
	for y > x {
		y = rng.Uint64()
	}

	return y
}

// Float64 returns a random float64 vetween [min, max].
func (r *RNG) Float64(min, max float64) float64 {
	rng := (*rand.Rand)(r)
	return min + rng.Float64()*(max-min)
}

// Bool returns a random boolean.
func (r *RNG) Bool() bool {
	return r.Int64(0, 2) == 1
}

// NormalFloat64 returns a random float64 using a normal distribution.
func (r *RNG) NormalFloat64(mean, stddev float64) float64 {
	rng := (*rand.Rand)(r)
	return (rng.NormFloat64() * stddev) + mean
}

// NormalInt64 returns a random int64 using a normal distribution.
func (r *RNG) NormalInt64(mean, stddev int64) int64 {
	x := math.Round(r.NormalFloat64(float64(mean), float64(stddev)))
	return int64(x)
}

// NormalUint64 returns a random uint64 using a normal distribution.
func (r *RNG) NormalUint64(mean, stddev uint64) uint64 {
	x := math.Round(r.NormalFloat64(float64(mean), float64(stddev)))
	if x < 0 {
		return 0
	}
	return uint64(x)
}

// Perm returns, as a slice of n ints, a pseudo-random permutation of the
// integers [0,n).
func (r *RNG) Perm(n int) []int {
	rng := (*rand.Rand)(r)
	return rng.Perm(n)
}

// PermN returns, as a slice of size ints, a pseudo-random permutation of the
// integers [0,n).
func (r *RNG) PermN(n, size int) []int {
	return r.Perm(n)[:size]
}

// PermRate returns, as a slice of ints, a pseudo-random permutation of the
// intergers [0,n).  The amount returned will be rate% of n.
func (r *RNG) PermRate(n, rate int) []int {
	count := int(math.Round(float64(n) * (float64(rate) / 100)))
	return r.PermN(n, count)
}

// Node returns a random node from a slice of nodes.
func (r *RNG) Node(nodes []*Node) *Node {
	i := r.Int64(0, int64(len(nodes)))
	return nodes[i]
}

// Edge returns a random edge from a slice of edges.
func (r *RNG) Edge(edges []*Edge) *Edge {
	i := r.Int64(0, int64(len(edges)))
	return edges[i]
}
