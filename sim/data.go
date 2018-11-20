package sim

import (
	"encoding/csv"
	"fmt"
)

// AgentDataColumn is a single cell of data in a row in the agent data file.
type AgentDataColumn int

// Agent data file columns.
const (
	ColumnAgentTimestep AgentDataColumn = iota

	ColumnAgentID
	ColumnAgentKind

	ColumnAgentLocationID
	ColumnAgentLocationX
	ColumnAgentLocationY
)

// AgentDataRow is a row of data in the agent data file.
type AgentDataRow map[AgentDataColumn]interface{}

// WriteAgentDataHeader writes a header row to a CSV file.
func WriteAgentDataHeader(w *csv.Writer) error {
	var record CSVRecord

	record.Add("Timestep")

	record.Add("ID")
	record.Add("Kind")

	record.Add("LocationID")
	record.Add("LocationX")
	record.Add("LocationY")

	return w.Write(record)
}

// Write writes this row to a CSV file.
func (r AgentDataRow) Write(w *csv.Writer) error {
	var record CSVRecord

	record.Add(r[ColumnAgentTimestep])

	record.Add(r[ColumnAgentID])
	record.Add(r[ColumnAgentKind])

	record.Add(r[ColumnAgentLocationID])
	record.Add(r[ColumnAgentLocationX])
	record.Add(r[ColumnAgentLocationY])

	return w.Write(record)
}

// NodeDataColumn is a single cell of data in a row in the intersections data
// file.
type NodeDataColumn int

// Node data file columns.
const (
	ColumnNodeTimestep NodeDataColumn = iota

	ColumnNodeID
	ColumnNodeX
	ColumnNodeY

	ColumnNodeNAgents
)

// NodeDataRow is a row of data in the intersections data file.
type NodeDataRow map[NodeDataColumn]interface{}

// WriteNodeDataHeader writes a header row to a CSV file.
func WriteNodeDataHeader(w *csv.Writer) error {
	var record CSVRecord

	record.Add("Timestep")

	record.Add("ID")
	record.Add("X")
	record.Add("Y")

	record.Add("NAgents")

	return w.Write(record)
}

// Write writes this row to a CSV file.
func (r NodeDataRow) Write(w *csv.Writer) error {
	var record CSVRecord

	record.Add(r[ColumnNodeTimestep])

	record.Add(r[ColumnNodeID])
	record.Add(r[ColumnNodeX])
	record.Add(r[ColumnNodeY])

	record.Add(r[ColumnNodeNAgents])

	return w.Write(record)
}

// CSVRecord represents a row in a CSV file.
type CSVRecord []string

// Add adds a cell to this record.
func (r *CSVRecord) Add(x interface{}) {
	*r = append(*r, fmt.Sprintf("%v", x))
}
