import * as moment from 'moment'

import { Agent }          from './agent/agent'
import { PoliceBehavior } from './agent/police'
import { Arena }          from './arena/arena'
import { Navigator }      from './arena/navigator'
import { Config }         from './config'
import { Messenger }      from './messenger'
import { Random }         from './random'

export class Simulator {

  agents: Agent[]
  arena: Arena
  navigator: Navigator
  rng: Random

  constructor(private config: Config) {
    Messenger.progress(0, 'seeding RNG')
    this.rng = new Random(config.ticks.seed)

    Messenger.progress(1, 'generating grid arena')
    this.arena = Arena.grid(config.arena.width, config.arena.height)

    Messenger.progress(2, 'building navigation tree')
    this.navigator = new Navigator(this.arena)

    this.agents = []

    Messenger.progress(3, 'generating police agents')
    this.makePolice()

    // TODO: Make civilians and offenders

    Messenger.progress(4, 'initializing agents')
    this.agents.forEach(agent => agent.init())
  }

  start() {
    console.log('Start Simulation')
    console.log('Config:', this.config)
    console.log('Arena:', this.arena)
    console.log('Navigator:', this.navigator)
    console.log('Agents:', this.agents)

    Messenger.progress(5, 'running simulation')

    // 90 progress steps for simulation, save last 5% for data file writing
    const step = Math.floor(this.config.ticks.total / 90)
    let i = 6

    const start = moment()

    for (let tick = 0; tick < this.config.ticks.total; tick++) {
      if (tick % step === 0) {
        Messenger.progress(i++, 'running simulation')
      }
      for (const agent of this.agents) {
        agent.move()
      }
      for (const agent of this.agents) {
        agent.action()
      }
    }

    const duration = moment.duration(moment().diff(start))
    let msg: string
    if (duration.asSeconds() > 60) {
      msg = `${duration.minutes()} minutes and ${duration.seconds()} seconds`
    } else {
      msg = `${duration.seconds()} seconds`
    }

    Messenger.progress(100, `finished in ${msg}`)

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
