package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path"
	"strings"

	"github.com/jieidson/arp/config"
	"github.com/jieidson/arp/provider"
)

func init() {
	flag.Usage = func() {
		fmt.Fprintf(flag.CommandLine.Output(), "Usage of ARP: %s <config> [<config> ...]\n", os.Args[0])
		flag.PrintDefaults()
	}
}

func main() {
	var outputBaseDir string
	var writeConfig string

	flag.StringVar(&outputBaseDir, "out", "", "Base directory for output files.")
	flag.StringVar(&writeConfig, "writeConfig", "", "Write an example config file to the specified file name.")
	flag.Parse()

	if writeConfig != "" {
		if _, err := os.Stat(writeConfig); os.IsNotExist(err) {
			ioutil.WriteFile(writeConfig, []byte(config.ExampleConfig), 0644)
			log.Println("wrote example config file:", writeConfig)
		} else {
			log.Fatalf("config file already exists, not overwriting")
		}
		return
	}

	if flag.NArg() == 0 {
		flag.Usage()
		return
	}

	configs := make(map[string]config.Config, flag.NArg())

	for _, arg := range flag.Args() {
		cfg, err := config.FromTOML(arg)
		if err != nil {
			log.Fatalf("error reading config file %s: %v", arg, err)
			return
		}

		if err := cfg.Validate(); err != nil {
			log.Fatalf("failed to validate config %s: %v", arg, err)
			return
		}

		basename := path.Base(arg)
		name := strings.TrimSuffix(basename, path.Ext(basename))

		configs[name] = cfg
	}

	for name, cfg := range configs {
		p := provider.New(name, outputBaseDir, cfg)

		if err := config.ToTOML(p.Files().File("config.toml"), p.Config); err != nil {
			log.Fatalln("failed to write config file:", err)
			return
		}

		arena := p.Arena()
		if err := p.Files().WriteFileString("arena.dot", arena.ToDot()); err != nil {
			log.Fatalln("failed to write arena file:", err)
			return
		}
	}

}
