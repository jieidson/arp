package config

// Config represents a configuration for a single run of the simulator.
type Config struct {
	RNG struct {
		Seed int64
	}

	Time struct {
		TicksPerDay uint64
		TotalDays   uint64
	}

	Arena ArenaConfig

	Moral struct {
		MajorMajorLow uint64
		MajorMinorLow uint64
		MinorMinorLow uint64

		RadiusMean   uint64
		RadiusStdDev uint64
	}

	Agent struct {
		Civilian uint64
		Offender uint64
		Police   uint64
	}

	Activity struct {
		SleepMean   uint64
		SleepStdDev uint64

		CountMean   uint64
		CountStdDev uint64
	}

	Workspace struct {
		MajorMajorLow  uint64
		MajorMajorHigh uint64
		MajorMinorLow  uint64
		MajorMinorHigh uint64
		MinorMinorLow  uint64
		MinorMinorHigh uint64
	}

	Economy struct {
		PayPeriod uint64
		PayRate   uint64

		Unemployment uint64
		HiringRate   uint64
		FiringRate   uint64

		WealthMean   uint64
		WealthStdDev uint64
	}

	Offender struct {
		Model    int
		Amount   uint64
		Cooldown uint64
	}
}

// ArenaConfig represents the configuration of the arena.
type ArenaConfig struct {
	Width  uint64
	Height uint64

	MajorX uint64
	MajorY uint64

	MinorWeight uint64
	MajorWeight uint64
}
