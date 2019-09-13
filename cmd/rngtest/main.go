package main

import (
	"fmt"
	"math"

	"github.com/jieidson/arp/sim"
)

const (
	testSeed = 1234

	size = 1000000
)

func main() {
	rng := sim.NewRNG(testSeed)

	values := make([]uint64, size)

	for i := range values {
		values[i] = rng.NormalUint64(720, 144)
	}

	var sum uint64
	for _, value := range values {
		sum += value
	}

	mean := float64(sum) / float64(size)
	fmt.Println("mean:", mean)

	var stddev float64
	for _, value := range values {
		stddev += math.Pow(float64(value)-mean, 2)
	}

	stddev = math.Sqrt(stddev / (size - 1))
	fmt.Println("stddev", stddev)
}
