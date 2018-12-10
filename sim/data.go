package sim

import (
	"bufio"
	"reflect"
	"strconv"
	"strings"
)

// AgentDataRow is a row of data in the agent data file.
type AgentDataRow struct {
	Timestep uint64

	ID   uint64
	Kind uint64

	LocationID uint64
	X, Y       uint64

	HomeID     uint64
	WorkID     int64 // -1 will represent unemployed
	Activities []uint64

	AtRisk bool
	Wealth uint64

	EvaluatedTargets, FoundTargets, FoundTarget bool

	TargetID     uint64
	Guardianship int64
	Suitability  int64
	Robbed       bool
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

		strconv.FormatUint(r.HomeID, 10),
		strconv.FormatInt(r.WorkID, 10),

		quotedUints(r.Activities),

		strconv.FormatBool(r.AtRisk),
		strconv.FormatUint(r.Wealth, 10),

		strconv.FormatBool(r.EvaluatedTargets),
		strconv.FormatBool(r.FoundTargets),
		strconv.FormatBool(r.FoundTarget),
		strconv.FormatUint(r.TargetID, 10),
		strconv.FormatInt(r.Guardianship, 10),
		strconv.FormatInt(r.Suitability, 10),
		strconv.FormatBool(r.Robbed),
	})
}

// NodeDataRow is a row of data in the intersections data file.
type NodeDataRow struct {
	Timestep uint64

	ID uint64

	X uint64
	Y uint64

	MoralContext int

	NAgents    uint64
	NLCPAgents uint64
	NHCPAgents uint64
	NPolice    uint64

	Robbery bool
}

// Write writes this row to a CSV file.
func (r NodeDataRow) Write(w *bufio.Writer) error {
	return writeRow(w, []string{
		strconv.FormatUint(r.Timestep, 10),

		strconv.FormatUint(r.ID, 10),

		strconv.FormatUint(r.X, 10),
		strconv.FormatUint(r.Y, 10),

		strconv.Itoa(r.MoralContext),

		strconv.FormatUint(r.NAgents, 10),
		strconv.FormatUint(r.NLCPAgents, 10),
		strconv.FormatUint(r.NHCPAgents, 10),
		strconv.FormatUint(r.NPolice, 10),

		strconv.FormatBool(r.Robbery),
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

func quotedUints(xs []uint64) string {
	var sb strings.Builder

	sb.WriteByte('"')

	for i, x := range xs {
		sb.WriteString(strconv.FormatUint(x, 10))
		if i < len(xs)-1 {
			sb.WriteByte(',')
		}
	}

	sb.WriteByte('"')

	return sb.String()
}
