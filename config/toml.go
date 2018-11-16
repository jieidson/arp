package config

import (
	"fmt"

	"github.com/BurntSushi/toml"
)

// FromTOML reads a TOML formatted configuration file, and returns the
// corresponding Config, or an error on failure.
func FromTOML(path string) (Config, error) {
	var config Config

	if _, err := toml.DecodeFile(path, &config); err != nil {
		return config, fmt.Errorf("error decoding configuration TOML: %v", err)
	}

	return config, nil
}
