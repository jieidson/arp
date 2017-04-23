import { Agent }          from './agent/agent'
import { PoliceBehavior } from './agent/police'
import { Arena }          from './arena/arena'
import { Navigator }      from './arena/navigator'
import { Config }         from './config'
import { Random }         from './random'

export class Simulator {

  agents: Agent[]
  arena: Arena
  navigator: Navigator
  rng: Random

  constructor(private config: Config) {
    this.rng = new Random(config.ticks.seed)
    this.arena = Arena.grid(config.arena.width, config.arena.height)
    this.navigator = new Navigator(this.arena)

    this.agents = []

    this.makePolice()

    // TODO: Make civilians and offenders

    this.agents.forEach(agent => agent.init())
  }

  start() {
    console.log('Start Simulation')
    console.log('Config:', this.config)
    console.log('Arena:', this.arena)
    console.log('Navigator:', this.navigator)
    console.log('Agents:', this.agents)

    for (let tick = 0; tick < this.config.ticks.total; tick++) {
      for (const agent of this.agents) {
        agent.move()
      }
      for (const agent of this.agents) {
        agent.action()
      }
    }

    console.log('done')
  }

  private makePolice(): void {
    const policeBehavior = new PoliceBehavior(this)

    for (let i = 0; i < this.config.agents.police; i++) {
      const agent = new Agent(this.agents.length)
      agent.behaviors.push(policeBehavior)
      this.agents.push(agent)
    }
  }

}
