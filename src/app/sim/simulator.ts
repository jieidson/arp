import { Arena }     from './arena/arena'
import { Navigator } from './arena/navigator'
import { Config }    from './config'
import { Random }    from './random'

export class Simulator {

  private rng: Random
  private arena: Arena
  private navigator: Navigator

  constructor(config: Config) {
    this.rng = new Random(config.ticks.seed)
    this.arena = Arena.randomGrid(config.arena.width, config.arena.height)
    this.navigator = new Navigator(this.arena)
  }

  start() {
    console.log('START SIMULATON')
    console.log('Arena:', this.arena)
    console.log('Navigator:', this.navigator)
  }

}
