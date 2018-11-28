package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path"
	"runtime"
	"runtime/pprof"
	"strings"
	"sync"

	"github.com/jieidson/arp/config"
	"github.com/jieidson/arp/sim"
)

func init() {
	flag.Usage = func() {
		fmt.Fprintf(flag.CommandLine.Output(), "Usage of ARP: %s <config> [<config> ...]\n", os.Args[0])
		flag.PrintDefaults()
	}
}

func main() {
	os.Exit(run())
}

func run() int {
	var outputBaseDir string
	var writeConfig string
	var cpuProfile string
	var memProfile string

	flag.StringVar(&outputBaseDir, "out", "", "Base directory for output files.")
	flag.StringVar(&writeConfig, "writeConfig", "", "Write an example config file to the specified file name.")
	flag.StringVar(&cpuProfile, "cpu", "", "Write a CPU profile to the specified file.")
	flag.StringVar(&memProfile, "mem", "", "Write a memory profile to the specified file.")
	flag.Parse()

	if writeConfig != "" {
		if _, err := os.Stat(writeConfig); os.IsNotExist(err) {
			ioutil.WriteFile(writeConfig, []byte(config.ExampleConfig), 0644)
			log.Println("wrote example config file:", writeConfig)
			return 0
		} else {
			log.Fatalf("config file already exists, not overwriting")
			return 1
		}
	}

	if flag.NArg() == 0 {
		flag.Usage()
		return 0
	}

	configs := make(map[string]config.Config, flag.NArg())

	for _, arg := range flag.Args() {
		cfg, err := config.FromTOML(arg)
		if err != nil {
			log.Fatalf("error reading config file %s: %v", arg, err)
			return 1
		}

		if err := cfg.Validate(); err != nil {
			log.Fatalf("failed to validate config %s: %v", arg, err)
			return 1
		}

		basename := path.Base(arg)
		name := strings.TrimSuffix(basename, path.Ext(basename))

		configs[name] = cfg
	}

	if cpuProfile != "" {
		f, err := os.Create(cpuProfile)
		if err != nil {
			log.Fatalln("failed to create CPU profile file:", err)
			return 1
		}
		pprof.StartCPUProfile(f)
		defer f.Close()
		defer pprof.StopCPUProfile()
	}

	runConfigs(configs, outputBaseDir)

	if memProfile != "" {
		f, err := os.Create(memProfile)
		if err != nil {
			log.Fatalln("failed to create memory profile file:", err)
			return 1
		}
		defer f.Close()

		runtime.GC()
		if err := pprof.WriteHeapProfile(f); err != nil {
			log.Fatalln("failed to write memory profile:", err)
		}
	}

	return 0
}

func runConfigs(configs map[string]config.Config, baseDir string) {
	for name, cfg := range configs {
		simulate(name, baseDir, cfg)
	}
}

func runConfigsParallel(configs map[string]config.Config, baseDir string) {
	var wg sync.WaitGroup
	wg.Add(len(configs))

	for name, cfg := range configs {
		go func(name string, cfg config.Config) {
			defer wg.Done()
			simulate(name, baseDir, cfg)
		}(name, cfg)
	}

	wg.Wait()
}

func simulate(name, outputBase string, cfg config.Config) {
	log.Println("starting simulation run:", name)
	defer func() {
		log.Println("ending simulation run:", name)
	}()

	p := sim.NewProvider(name, outputBase, cfg)
	defer p.Close()

	if err := config.ToTOML(p.Files().File("config.toml"), cfg); err != nil {
		log.Println("failed to write config file:", err)
		return
	}

	arena := p.Arena()
	if err := p.Files().WriteFileString("arena.dot", arena.ToDot()); err != nil {
		log.Println("failed to write arena file:", err)
		return
	}

	p.Navigator()

	if err := p.Simulator().Loop(); err != nil {
		log.Println("failed to run simulation loop:", err)
		return
	}
}

// navigator := p.Navigator()

// p.Logger().Println("writing navigation CSVs")

// if err := writeMatrix(p, "distance.csv", navigator.Dist, len(arena.Nodes)); err != nil {
// 	log.Println("failed to write distance matrix:", err)
// 	return
// }

// if err := writeMatrix(p, "next-node.csv", navigator.Next, len(arena.Nodes)); err != nil {
// 	log.Println("failed to write next node matrix:", err)
// 	return
// }
// }

// func writeMatrix(p *sim.Provider, n string, m []uint64, size int) error {
// 	f, err := p.Files().CreateFile("distance.csv")
// 	if err != nil {
// 		return fmt.Errorf("failed to create file: %v", err)
// 	}
// 	defer f.Close()

// 	w := bufio.NewWriter(f)
// 	defer w.Flush()

// 	// Write header row, first cell is blank
// 	if err := w.WriteByte(','); err != nil {
// 		return err
// 	}

// 	for i := 0; i < size; i++ {
// 		if _, err := w.WriteString(strconv.Itoa(i)); err != nil {
// 			return err
// 		}
// 		if i < size-1 {
// 			if err := w.WriteByte(','); err != nil {
// 				return err
// 			}
// 		}
// 	}
// 	if err := w.WriteByte('\n'); err != nil {
// 		return err
// 	}

// 	// Write each row
// 	for y := 0; y < size; y++ {
// 		// Write column number first
// 		if _, err := w.WriteString(strconv.Itoa(y)); err != nil {
// 			return err
// 		}
// 		if err := w.WriteByte(','); err != nil {
// 			return err
// 		}

// 		for x := 0; x < size; x++ {
// 			i := y*size + x
// 			if _, err := w.WriteString(strconv.FormatUint(m[i], 10)); err != nil {
// 				return err
// 			}

// 			if x < size-1 {
// 				if err := w.WriteByte(','); err != nil {
// 					return err
// 				}
// 			}
// 		}

// 		if err := w.WriteByte('\n'); err != nil {
// 			return err
// 		}
// 	}

// 	return nil
// }
