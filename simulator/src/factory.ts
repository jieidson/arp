import { RNGConfig, ArenaConfig } from '@arp/shared'

import { Arena, basicGrid } from './arena/arena'
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

export function makeArena(config: ArenaConfig): Arena {
  switch (config.type) {
    case 'grid':
      return basicGrid(config.width, config.height)

    default:
      throw new Error('invalid arena config')
  }
}
