export interface Config {
  rng: RNGConfig
  arena: ArenaConfig
  morals: MoralContextConfig
  workSpaces: WorkSpaceConfig
}

// RNG Configuration

export interface MersenneTwisterRNGConfig {
  type: 'mersenne-twister'
  seed: number
}

export interface CryptoRNGConfig {
  type: 'crypto'
}

export type RNGConfig = MersenneTwisterRNGConfig | CryptoRNGConfig

// Arena Configuration

export interface SimpleGridArenaConfig {
  type: 'simple-grid'
  width: number
  height: number
}

export interface WeightedGridArenaConfig {
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

export type ArenaConfig = SimpleGridArenaConfig | WeightedGridArenaConfig

// Moral Context Configuration

export interface RandomMoralContextConfig {
  type: 'random'
  // Percent of nodes which are centers of low moral context
  lowPercent: number
  radiusMean: number
  radiusStdDev: number
}

export interface MajorMinorMoralContextConfig {
  type: 'major-minor'

  majorMajorPercent: number
  majorMinorPercent: number
  minorMinorPercent: number

  radiusMean: number
  radiusStdDev: number
}

export type MoralContextConfig = RandomMoralContextConfig

// Work Space Configuration

export interface RandomWorkSpaceConfig {
  type: 'random'
}

export interface MoralWorkSpaceConfig {
  type: 'moral'

  lowPercent: number
}

export interface MajorMinorMoralWorkSpaceConfig {
  type: 'major-minor-moral'

  majorMajorLow: number
  majorMajorHigh: number
  majorMinorLow: number
  majorMinorHigh: number
  minorMinorLow: number
  minorMinorHigh: number
}

export type WorkSpaceConfig = RandomWorkSpaceConfig | MoralWorkSpaceConfig | MajorMinorMoralWorkSpaceConfig
