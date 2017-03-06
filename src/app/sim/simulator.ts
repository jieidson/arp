import { Agent }          from './agent/agent'
import { PoliceBehavior } from './agent/police'
import { Arena }          from './arena/arena'
import { Navigator }      from './arena/navigator'
import { Config }         from './config'
import { Clock }          from './event/clock'
import { Dispatcher }     from './event/dispatcher'
import { Random }         from './random'

export class Simulator {

  agents: Agent[]
  arena: Arena
  clock: Clock
  dispatcher: Dispatcher
  navigator: Navigator
  rng: Random

  constructor(private config: Config) {
    this.rng = new Random(config.ticks.seed)
    this.arena = Arena.randomGrid(config.arena.width, config.arena.height)
    this.navigator = new Navigator(this.arena)

    this.dispatcher = new Dispatcher()
    this.clock = new Clock(this.dispatcher)

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

    for (let i = 0; i < this.config.ticks.total; i++) {
      this.clock.tick()
      //console.log('tick')
    }
    console.log('done')
  }

  private makePoliceAgent(id: number): Agent {
    const agent = new Agent(id, this)
    agent.behaviors.push(new PoliceBehavior(agent))
    return agent
  }

}
