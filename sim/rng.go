package sim

import (
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

// Float64 returns a random float64 vetween [min, max].
func (r *RNG) Float64(min, max float64) float64 {
	rng := (*rand.Rand)(r)
	return min + rng.Float64()*(max-min)
}

// Normal returns a random float using a normal distribution.
func (r *RNG) Normal(mean, stddev float64) float64 {
	rng := (*rand.Rand)(r)
	return (rng.NormFloat64() * stddev) + mean
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
	count := int(float64(n) * (float64(rate) / 100))
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
