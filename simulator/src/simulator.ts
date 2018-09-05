import { Config } from '@arp/shared'

import * as factory from './factory'
import { Messenger } from './messenger'

export class Simulator {

  constructor(
    private readonly messenger: Messenger,
  ) {}

  start(): void {
    this.messenger.commands$.subscribe(command => {
      switch (command.type) {
        case 'run':
          this.run(command.config)
          break

        default:
          console.error('unknown command type:', command.type)
      }
    })
  }

  private run(config: Config): void {
    console.info('running simulator')
    console.info('config:', config)

    const rng = factory.makeRNG(config.rng)
    console.info('RNG:', rng)

    const arena = factory.makeArena(config.arena, rng)
    console.info('Arena:', arena)

    this.messenger.send({
      type: 'ready',
      arena: {
        width: arena.width,
        height: arena.height,
        nodes: arena.nodes.map(node => ({ id: node.id })),
        edges: arena.edges.map(edge => ({
          left: edge.left.id,
          right: edge.right.id,
          weight: edge.weight,
        })),
      },
    })
  }

}
