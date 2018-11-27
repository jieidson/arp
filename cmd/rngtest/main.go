package main

import (
	"fmt"
	"sort"

	"github.com/jieidson/arp/sim"
)

const testSeed = 1234
const iterations = 1000000

func main() {
	rng := sim.NewRNG(testSeed)

	values := make([]float64, 0, iterations)

	for i := 0; i < iterations; i++ {
		values = append(values, rng.Float64(0, 10))
	}

	sort.Float64Slice(values).Sort()

	fmt.Println("value")
	for _, value := range values {
		fmt.Println(value)
	}
}
