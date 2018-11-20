package sim

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"time"
)

const timestampFormat = "2006-01-02.15-04-05"

// Files is a structure that manages output files.
type Files struct {
	OutDir string
}

// NewFiles creates a new file manager.
func NewFiles(base, name string) (*Files, error) {
	timestamp := time.Now().Format(timestampFormat)
	outdir := filepath.Join(base, fmt.Sprintf("%s-%s", name, timestamp))

	if err := os.MkdirAll(outdir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create output directory: %v", err)
	}

	return &Files{OutDir: outdir}, nil
}

// File returns the path to a file in the output directory.
func (f *Files) File(name string) string {
	return filepath.Join(f.OutDir, name)
}

// CreateFile creates a new file in the output directory.
func (f *Files) CreateFile(name string) (*os.File, error) {
	return os.Create(f.File(name))
}

// WriteFile writes the given data to a file.
func (f *Files) WriteFile(name string, data []byte) error {
	return ioutil.WriteFile(f.File(name), data, 0644)
}

// WriteFileString writes the given data to a file.
func (f *Files) WriteFileString(name, data string) error {
	return f.WriteFile(name, []byte(data))
}
