import { Agent }          from './agent/agent'
import { PoliceBehavior } from './agent/police'
import { Arena }          from './arena/arena'
import { Navigator }      from './arena/navigator'
import { Config }         from './config'
import { Random }         from './random'

export class Simulator {

  rng: Random
  arena: Arena
  navigator: Navigator
  agents: Agent[]

  constructor(config: Config) {
    this.rng = new Random(config.ticks.seed)
    this.arena = Arena.randomGrid(config.arena.width, config.arena.height)
    this.navigator = new Navigator(this.arena)
    this.agents = []

    for (let i = 0; i < config.agents.police; i++) {
      this.agents.push(this.makePoliceAgent(this.agents.length))
    }

    // TODO: Make civilians and offenders

    this.agents.forEach(agt => agt.init())
  }

  start() {
    console.log('Start Simulation')
    console.log('Arena:', this.arena)
    console.log('Navigator:', this.navigator)
    console.log('Agents:', this.agents)
  }

  private makePoliceAgent(id: number): Agent {
    const agent = new Agent(id, this)
    agent.behaviors.push(new PoliceBehavior())
    return agent
  }

}
