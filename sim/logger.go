package sim

import (
	"log"
	"os"
)

// Logger is a logger that reports messages to the console and a log file.
type Logger struct {
	toFile    *log.Logger
	toConsole *log.Logger
}

// NewLogger returns a new instance of a logger.
func NewLogger(f *os.File) *Logger {
	return &Logger{
		toFile:    log.New(f, "", log.Ldate|log.Ltime),
		toConsole: log.New(os.Stderr, "", log.LstdFlags),
	}
}

// Println calls l.Output to print to the logger. Arguments are handled in the
// manner of fmt.Println.
func (l *Logger) Println(v ...interface{}) {
	l.toFile.Println(v...)
	l.toConsole.Println(v...)
}

// Printf calls l.Output to print to the logger. Arguments are handled in the
// manner of fmt.Printf.
func (l *Logger) Printf(format string, v ...interface{}) {
	l.toFile.Printf(format, v...)
	l.toConsole.Printf(format, v...)
}
