import { Injectable } from '@angular/core'

import { Config }    from './config'
import { Simulator } from './simulator'

@Injectable()
export class RunnerService {

  start(config: Config): void {
    const sim = new Simulator(config)
    sim.start()
  }

}

    //const agents: Agent[] = new Array(
    //  c.agents.civilian + c.agents.offender + c.agents.police)
    //for (let i = 0; i < agents.length; i++) {

    //  // Select a home and work location for each agent
    //  const [home, work] = rng.sample(arena.nodes, 2)

    //  const agent = new Agent(i, home, work)
    //  agents[i] = agent

    //  // Start the agent at home
    //  home.enter(agent)

    //  console.log(`Agent ${agent.id}: home = ${agent.home.id} work = ${agent.work.id}`)
    //}
