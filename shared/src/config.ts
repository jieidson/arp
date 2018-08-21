export interface Config {
  rng: RNGConfig
  arena: ArenaConfig
}

export interface MersenneTwisterRNGConfig {
  type: 'mersenne-twister'
  seed: number
}

export interface CryptoRNGConfig {
  type: 'crypto'
}

export type RNGConfig = MersenneTwisterRNGConfig | CryptoRNGConfig

export interface SimpleGridArenaConfig {
  type: 'simple-grid'
  width: number
  height: number
}

export interface WeightedGridArenaConfig {
  type: 'weighted-grid'
  width: number
  height: number

  majorX: number
  majorY: number

  minorWeight: number
  majorWeight: number
}

export type ArenaConfig = SimpleGridArenaConfig | WeightedGridArenaConfig

export function defaultConfig(): Config {
  return {
    rng: {
      type: 'mersenne-twister',
      seed: 12345,
    },
    arena: {
      type: 'simple-grid',
      width: 5,
      height: 5,
    },
  }
}
