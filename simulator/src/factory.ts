import { ArenaConfig, RNGConfig } from '@arp/shared'

import { Arena, simpleGrid, weightedGrid } from './arena/arena'
import { CryptoRNG, MersenneTwisterRNG, RNG } from './rng'

export function makeRNG(config: RNGConfig): RNG {
  switch (config.type) {
    case 'mersenne-twister':
      return new MersenneTwisterRNG(config.seed)

    case 'crypto':
      return new CryptoRNG()

    default:
      throw new Error('invalid RNG type')
  }
}

export function makeArena(config: ArenaConfig, rng: RNG): Arena {
  switch (config.type) {
    case 'simple-grid':
      return simpleGrid(config)

    case 'weighted-grid':
      return weightedGrid(config, rng)

    default:
      throw new Error('invalid arena config')
  }
}
