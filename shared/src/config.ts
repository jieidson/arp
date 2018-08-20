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

export interface GridArenaConfig {
  type: 'grid'
  width: number
  height: number
}

export type ArenaConfig = GridArenaConfig

export function defaultConfig(): Config {
  return {
    rng: {
      type: 'mersenne-twister',
      seed: 12345,
    },
    arena: {
      type: 'grid',
      width: 5,
      height: 5,
    },
  }
}
