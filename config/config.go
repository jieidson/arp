package config

// Config represents a configuration for a single run of the simulator.
type Config struct {
	RNG struct {
		Seed int64
	}

	Time struct {
		TicksPerDay uint
		TotalDays   uint
	}

	Arena ArenaConfig

	Moral struct {
		MajorMajorLow uint
		MajorMinorLow uint
		MinorMinorLow uint

		RadiusMean   uint
		RadiusStdDev uint
	}

	Agent struct {
		Civilian uint
		Offender uint
		Police   uint
	}

	Activity struct {
		SleepMean   uint
		SleepStdDev uint

		CountMean   uint
		CountStdDev uint
	}

	Workspace struct {
		MajorMajorLow  uint
		MajorMajorHigh uint
		MajorMinorLow  uint
		MajorMinorHigh uint
		MinorMinorLow  uint
		MinorMinorHigh uint
	}

	Economy struct {
		PayPeriod uint
		PayRate   uint

		Unemployment uint
		HiringRate   uint
		FiringRate   uint

		WealthMean   uint
		WealthStdDev uint
	}

	Offender struct {
		Amount   uint
		Cooldown uint
	}
}

// ArenaConfig represents the configuration of the arena.
type ArenaConfig struct {
	Width  uint
	Height uint

	MajorX uint
	MajorY uint

	MinorWeight uint
	MajorWeight uint
}
