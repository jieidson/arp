import { Agent }     from './agent'
import { Behavior }  from './behavior'

export class PoliceBehavior implements Behavior {

  constructor(private agent: Agent) {}

  init(): void {
    // Randomly choose a starting location
    this.agent.location = this.agent.sim.rng.pick(this.agent.sim.arena.nodes)

    this.agent.sim.clock.movement$.subscribe(this.onMovement.bind(this))
  }

  // Police agents move randomly
  private onMovement(): void {
    const cur = this.agent.location

    // Pick a random path to walk down
    const edge = this.agent.sim.rng.pick(cur.edges)
    edge.follow(this.agent)

    //console.log(`${this.agent.id}: move ${cur.id} -> ${this.agent.location.id}`)
  }

}
