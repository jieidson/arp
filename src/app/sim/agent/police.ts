import { Agent }     from './agent'
import { Behavior }  from './behavior'

export class PoliceBehavior implements Behavior {

  init(agent: Agent): void {
    // Randomly choose a starting location
    agent.location = agent.sim.rng.pick(agent.sim.arena.nodes)
  }

}
