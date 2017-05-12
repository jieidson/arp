import { Node }      from '../arena/node'
import { Simulator } from '../simulator'
import { Agent }     from './agent'
import { Behavior }  from './behavior'

export interface CivilianData {
  activities: Node[]
  target: number
}

export class CivilianBehavior implements Behavior {

  constructor(private sim: Simulator) {}

  init(agent: Agent): void {
    const data: CivilianData {
      // Randomly choose home, and three activity locations
      activities: this.sim.rng.sample(this.sim.arena.nodes, 4),

      // Agent's target is the first activity location
      target: 1,
    }

    agent.data.civilian = data

    // Agent starts at home
    agent.location = data.activities[0]
  }

  move(agent: Agent): void {
    const data: CivilianData = agent.data.civilian
    const current = agent.location
    const targetNode = data.activities[data.target]

    // Move towards the current target
    const edge = this.sim.navigator.nextEdge(agent.location, targetNode)
    if (edge === undefined) {
      throw new Error(`No path to target: ${agent.id}: ${current.id} -> ${targetNode.id}`)
    }
    edge.follow(agent)
  }

  action(agent: Agent): void {
    const data: CivilianData = agent.data.civilian
    const targetNode = data.activities[data.target]

    // If agent is at the target, pick a new target
    if (agent.location === targetNode) {
      data.target = (data.target + 1) % data.activities.length
    }
  }

}

