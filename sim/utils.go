package sim

import (
	"log"
	"runtime"
	"sync"
)

func indexInt(x, y, size int) int {
	return y*size + x
}

func indexUint64(x, y, size uint64) uint64 {
	return y*size + x
}

func inUint64Slice(s []uint64, x uint64) bool {
	for _, i := range s {
		if i == x {
			return true
		}
	}
	return false
}

func runParallel(count int, worker func(id, start, end int)) {
	ncpu := runtime.NumCPU() - 1
	increment := count / ncpu

	var wg sync.WaitGroup
	wg.Add(ncpu)

	for p := 0; p < ncpu; p++ {
		start := increment * p
		end := start + increment

		if count%ncpu != 0 && p == ncpu-1 {
			end = count
		}

		log.Printf("Start=%d End=%d", start, end)

		go func(p, start, end int) {
			defer wg.Done()
			worker(p, start, end)
		}(p, start, end)
	}

	wg.Wait()
}
