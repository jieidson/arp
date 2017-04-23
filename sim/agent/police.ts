import { Simulator } from 'simulator'
import { Agent }     from './agent'
import { Behavior }  from './behavior'

export class PoliceBehavior implements Behavior {

  constructor(private sim: Simulator) {}

  init(agent: Agent): void {
    // Randomly choose a starting location
    agent.location = this.sim.rng.pick(this.sim.arena.nodes)
  }

  move(agent: Agent): void {
    // Police agents move randomly
    const current = agent.location

    // Pick a random path to walk down
    const edge = this.sim.rng.pick(current.edges)
    edge.follow(agent)

    // console.log(`${agent.id}: move ${current.id} -> ${agent.location.id}`)
  }

  action(_: Agent): void {}

}
