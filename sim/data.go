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

	State        uint64
	TargetID     uint64
	Guardianship int64
	Suitability  int64
}

// Write writes this row to a CSV file.
func (r *AgentDataRow) Write(w *bufio.Writer) error {
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

		strconv.FormatUint(r.State, 10),
		strconv.FormatUint(r.TargetID, 10),
		strconv.FormatInt(r.Guardianship, 10),
		strconv.FormatInt(r.Suitability, 10),
	})
}

// NodeDataRow is a row of data in the intersections data file.
type NodeDataRow struct {
	Timestep uint64

	ID uint64

	X uint64
	Y uint64

	MoralContext int
	Kind         int

	JobSiteCount uint64

	AgentCount  uint64
	LCPCount    uint64
	HCPCount    uint64
	PoliceCount uint64

	AtRiskCount uint64

	Robbery bool
}

// Write writes this row to a CSV file.
func (r *NodeDataRow) Write(w *bufio.Writer) error {
	return writeRow(w, []string{
		strconv.FormatUint(r.Timestep, 10),

		strconv.FormatUint(r.ID, 10),

		strconv.FormatUint(r.X, 10),
		strconv.FormatUint(r.Y, 10),

		strconv.Itoa(r.MoralContext),
		strconv.Itoa(r.Kind),

		strconv.FormatUint(r.JobSiteCount, 10),

		strconv.FormatUint(r.AgentCount, 10),
		strconv.FormatUint(r.LCPCount, 10),
		strconv.FormatUint(r.HCPCount, 10),
		strconv.FormatUint(r.PoliceCount, 10),

		strconv.FormatBool(r.Robbery),
	})
}

// AggregateAgentDataRow is a row of per-agent aggregate data.
type AggregateAgentDataRow struct {
	ID   uint64
	Kind uint64

	TravelDistance  uint64
	TotalVictimized uint64
	TotalOffended   uint64
}

// Write writes this row to a CSV file.
func (r *AggregateAgentDataRow) Write(w *bufio.Writer) error {
	return writeRow(w, []string{
		strconv.FormatUint(r.ID, 10),
		strconv.FormatUint(r.Kind, 10),

		strconv.FormatUint(r.TravelDistance, 10),
		strconv.FormatUint(r.TotalVictimized, 10),
		strconv.FormatUint(r.TotalOffended, 10),
	})
}

// AggregateNodeDataRow is a row of per-node aggregate data.
type AggregateNodeDataRow struct {
	ID uint64

	X uint64
	Y uint64

	MoralContext int
	Kind         int

	TotalConvergences  uint64
	TotalOpportunities uint64
	TotalRobberies     uint64
	TotalPolice        uint64
	TotalLCP           uint64
	TotalHCP           uint64
}

// Write writes this row to a CSV file.
func (r *AggregateNodeDataRow) Write(w *bufio.Writer) error {
	return writeRow(w, []string{
		strconv.FormatUint(r.ID, 10),

		strconv.FormatUint(r.X, 10),
		strconv.FormatUint(r.Y, 10),

		strconv.Itoa(r.MoralContext),
		strconv.Itoa(r.Kind),

		strconv.FormatUint(r.TotalConvergences, 10),
		strconv.FormatUint(r.TotalOpportunities, 10),
		strconv.FormatUint(r.TotalRobberies, 10),
		strconv.FormatUint(r.TotalPolice, 10),
		strconv.FormatUint(r.TotalLCP, 10),
		strconv.FormatUint(r.TotalHCP, 10),
	})
}

// TimestepDataRow is a row of per-timestep aggregate data.
type TimestepDataRow struct {
	Timestep uint64

	TotalConvergences  uint64
	TotalOpportunities uint64
	TotalRobberies     uint64
}

// Write writes this row to a CSV file.
func (r *TimestepDataRow) Write(w *bufio.Writer) error {
	return writeRow(w, []string{
		strconv.FormatUint(r.Timestep, 10),

		strconv.FormatUint(r.TotalConvergences, 10),
		strconv.FormatUint(r.TotalOpportunities, 10),
		strconv.FormatUint(r.TotalRobberies, 10),
	})
}

// OutcomesDataRow is a row of total outcomes data
type OutcomesDataRow struct {
	TotalRobberies       uint64
	AverageNodeRobberies uint64

	TotalOffenders uint64
	TotalVictims   uint64

	MajorMajorRobberies uint64
	MajorMinorRobberies uint64
	MinorMinorRobberies uint64
}

// Write writes this row to a CSV file.
func (r *OutcomesDataRow) Write(w *bufio.Writer) error {
	return writeRow(w, []string{
		strconv.FormatUint(r.TotalRobberies, 10),
		strconv.FormatUint(r.AverageNodeRobberies, 10),
		strconv.FormatUint(r.TotalOffenders, 10),
		strconv.FormatUint(r.TotalVictims, 10),
		strconv.FormatUint(r.MajorMajorRobberies, 10),
		strconv.FormatUint(r.MajorMinorRobberies, 10),
		strconv.FormatUint(r.MinorMinorRobberies, 10),
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

// WriteAggregateAgentDataHeader writes a CSV header of the agent data row.
func WriteAggregateAgentDataHeader(w *bufio.Writer) error {
	return writeDataHeader(w, AggregateAgentDataRow{})
}

// WriteAggregateNodeDataHeader writes a CSV header of the node data row.
func WriteAggregateNodeDataHeader(w *bufio.Writer) error {
	return writeDataHeader(w, AggregateNodeDataRow{})
}

// WriteTimestepDataHeader writes a CSV header of the node data row.
func WriteTimestepDataHeader(w *bufio.Writer) error {
	return writeDataHeader(w, TimestepDataRow{})
}

// WriteOutcomesDataHeader writes a CSV header of the node data row.
func WriteOutcomesDataHeader(w *bufio.Writer) error {
	return writeDataHeader(w, OutcomesDataRow{})
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
