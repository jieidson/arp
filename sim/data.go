package sim

import (
	"bufio"
	"reflect"
	"strconv"
)

// AgentDataRow is a row of data in the agent data file.
type AgentDataRow struct {
	Timestep uint64

	ID   uint64
	Kind uint64

	LocationID uint64
	X          uint64
	Y          uint64
}

// Write writes this row to a CSV file.
func (r AgentDataRow) Write(w *bufio.Writer) error {
	return writeRow(w, []string{
		strconv.FormatUint(r.Timestep, 10),

		strconv.FormatUint(r.ID, 10),
		strconv.FormatUint(r.Kind, 10),

		strconv.FormatUint(r.LocationID, 10),
		strconv.FormatUint(r.X, 10),
		strconv.FormatUint(r.Y, 10),
	})
}

// NodeDataRow is a row of data in the intersections data file.
type NodeDataRow struct {
	Timestep uint64

	ID uint64

	X uint64
	Y uint64

	NAgents uint64
}

// Write writes this row to a CSV file.
func (r NodeDataRow) Write(w *bufio.Writer) error {
	return writeRow(w, []string{
		strconv.FormatUint(r.Timestep, 10),

		strconv.FormatUint(r.ID, 10),

		strconv.FormatUint(r.X, 10),
		strconv.FormatUint(r.Y, 10),

		strconv.FormatUint(r.NAgents, 10),
	})
}

// WriteAgentDataHeader writes a CSV header of the agent data row.
func WriteAgentDataHeader(w *bufio.Writer) error {
	return writeDataHeader(w, AgentDataRow{})
}

// WriteNodeDataHeader writes a CSV header of the node data row.
func WriteNodeDataHeader(w *bufio.Writer) error {
	return writeDataHeader(w, NodeDataRow{})
}

// writeDataHeader writes a CSV header for the given type.
func writeDataHeader(w *bufio.Writer, x interface{}) error {
	v := reflect.ValueOf(x)
	t := v.Type()

	for i := 0; i < v.NumField(); i++ {
		if _, err := w.WriteString(t.Field(i).Name); err != nil {
			return err
		}
		if i < v.NumField()-1 {
			if err := w.WriteByte(','); err != nil {
				return err
			}
		}
	}

	return w.WriteByte('\n')
}

func writeRow(w *bufio.Writer, row []string) error {
	for i, field := range row {
		if _, err := w.WriteString(field); err != nil {
			return err
		}

		if i < len(row)-1 {
			if err := w.WriteByte(','); err != nil {
				return err
			}

		}
	}

	return w.WriteByte('\n')
}
