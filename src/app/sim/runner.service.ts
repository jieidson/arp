import { Injectable } from '@angular/core'

import { Agent, Arena }  from './arena'
import { Config }        from './config'
import { Random }        from './random'

@Injectable()
export class RunnerService {

  start(c: Config): void {
    console.log('Config:', c)

    const rng = new Random(c.ticks.seed)

    const arena = Arena.randomGrid(c.arena.width, c.arena.height)
    console.log('Arena:', arena)

    // TODO: Generate shortest-path trees using:
    // https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
    // https://github.com/cytoscape/cytoscape.js/blob/master/src/collection/algorithms/floyd-warshall.js

    const agents: Agent[] = new Array(
      c.agents.civilian + c.agents.offender + c.agents.police)
    for (let i = 0; i < agents.length; i++) {

      // Select a home and work location for each agent
      const [home, work] = rng.sample(arena.nodes, 2)

      const agent = new Agent(i, home, work)
      agents[i] = agent

      // Start the agent at home
      home.enter(agent)

      console.log(`Agent ${agent.id}: home = ${agent.home.id} work = ${agent.work.id}`)
    }
  }


}
