package main

import (
	"flag"
	"io/ioutil"
	"log"
	"os"

	"github.com/jieidson/arp/config"
)

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

	configs := make([]config.Config, 0, flag.NArg())

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

		configs = append(configs, cfg)
	}

}
