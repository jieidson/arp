package config

import (
	"fmt"
	"os"

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

// ToTOML writes a config to the specified file.
func ToTOML(path string, config Config) error {
	f, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("failed to create output config file: %v", err)
	}
	defer f.Close()

	enc := toml.NewEncoder(f)
	if err := enc.Encode(config); err != nil {
		return fmt.Errorf("failed to encode config file: %v", err)
	}

	return nil
}
