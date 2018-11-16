package config

const ExampleConfig = `# Example ARP Simulator Configuration File

[rng]

  # Seed for the random number generator. The simulator is deterministic, runs
  # with the same parameters (should) generate the same output.
  seed = 1234


[time]

  # Number of ticks in one simulation day.
  ticksPerDay = 1440    # 60 seconds * 24 hours

  # Number of days in a simulation run.
  totaldays = 30


# The arena is a grid of nodes and edges.
[arena]

  width = 5
  height = 5

  # Number of horizontal major streets.
  majorX = 2

  # Number of vertical major streets.
  majorY = 2

  # Edge weight of minor streets.
  minorWeight = 5

  # Edge weight of major streets.
  majorWeight = 1


[moral]

  # All nodes default to high moral context.

  # Percent of intersections with low moral context. These parameters should
  # sum to 100
  majorMajorLow = 60
  majorMinorLow = 20
  minorMinorLow = 20

  # Mean for radius that a low moral context node affects neighbors.
  radiusMean = 0
  radiusStdDev = 0


[agent]

  # Number of agents in the simulation.
  civilian = 8
  offender = 2
  police = 2


[activity]

  # The number of ticks an agent sleeps at home.
  sleepMean = 720
  sleepStdDev = 144

  # The number of activity locations an agent chooses each day.
  countMean = 1
  countStdDev = 2


[workspace]

  # Distribution of work spaces in the arena.  The sum of these parameters
  # should equal 100
  majorMajorLow = 15
  majorMajorHigh = 20
  majorMinorLow = 15
  majorMinorHigh = 20
  minorMinorLow = 10
  minorMinorHigh = 20


[economy]

  # Number of ticks in a pay period.
  payPeriod = 20160    # 60 seconds * 24 hours * 14 days

  # Amount of money each agent gains each pay period.
  payRate = 5

  # Initial unemployment rate.
  unemployment = 7

  # Rates of hiring and firing each pay period.
  hiringRate = 3
  firingRate = 3

  # Amount of money agents start with.
  wealthMean = 50
  wealthStdDev = 20


[offender]

  # Amount stolen per robbery.
  amount = 1

  # Number of ticks before an offender can choose to offend again.
  cooldown = 60
`
