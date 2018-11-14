export interface Config {
  rng: RNGConfig
  time: TimeConfig
  arena: ArenaConfig
  moral: MoralContextConfig

  agent: AgentDistributionConfig
  activity: ActivityConfig
  workspace: WorkspaceConfig
  economy: EconomyConfig
  offender: OffenderConfig
}

/**** Random Number Generator Config ******************************************/

export interface RNGConfig {
  type: 'mersenne-twister'
  seed: number
}

/**** Time Config *************************************************************/

export interface TimeConfig {
  type: 'days'
  ticksPerDay: number
  totalDays: number
}

/**** Arena Config ************************************************************/

export interface ArenaConfig {
  type: 'weighted-grid'
  width: number
  height: number

  // Horizontal major streets
  majorX: number

  // Vertial major streets
  majorY: number

  // Edge weight for minor streets
  minorWeight: number

  // Edge weight for major streets
  majorWeight: number
}

/**** Moral Context Distribution Config ***************************************/

export interface MoralContextConfig {
  type: 'major-minor'

  majorMajor: number
  majorMinor: number
  minorMinor: number

  radiusMean: number
  radiusStdDev: number
}

/**** Agent Distribution Config ***********************************************/

export interface AgentDistributionConfig {
  type: 'normal'

  civilian: number
  offender: number
  police: number
}

/**** Activity Config *********************************************************/

export interface ActivityConfig {
  type: 'activity'

  // Time an agent spends at home
  sleepMean: number
  sleepStdDev: number

  // Number of additional activity locations an agent has
  countMean: number
  countStdDev: number
}

/**** Workspace Config ********************************************************/

export interface WorkspaceConfig {
  type: 'major-minor-moral'

  majorMajorLow: number
  majorMajorHigh: number
  majorMinorLow: number
  majorMinorHigh: number
  minorMinorLow: number
  minorMinorHigh: number
}

/**** Economy Config **********************************************************/

export interface EconomyConfig {
  type: 'employment'

  unemployment: number
  hiringRate: number
  firingRate: number

  wealthMean: number
  wealthStdDev: number

  payRate: number
  payPeriod: number
}

/**** Offender Config *********************************************************/

export interface OffenderConfig {
  type: 'robber'

  amount: number
  cooldown: number
}
