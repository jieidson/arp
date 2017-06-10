import { Node }      from '../arena/node'
import { Simulator } from '../simulator'
import { Agent }     from './agent'
import { Behavior }  from './behavior'

export interface CivilianData {
  activities: Node[]
  active: boolean
  target: number

  activityTicks: number[]
  travelTicks: number[]

  becomeActiveTick: number
}

export class CivilianBehavior implements Behavior {

  constructor(private sim: Simulator) {}

  init(agent: Agent): void {
    const data: CivilianData = {
      // Randomly choose home, and three activity locations
      activities: this.sim.rng.sample(this.sim.arena.nodes, 4),

      active: false,

      // Agent's target is the first activity location
      target: 1,

      activityTicks: new Array(4),
      travelTicks: new Array(4),

      becomeActiveTick: 0,
    }

    // Number of ticks to stay at home
    data.activityTicks[0] = Math.round(this.sim.rng.gaussian(
      this.sim.config.civilians.homeTicksMean,
      this.sim.config.civilians.homeTicksDeviation,
    ))

    // Maximum number of ticks to travel between locations
    for (let i = 0; i < data.activities.length; i++) {
      const nexti = (i + 1) % data.activities.length
      data.travelTicks[i] = this.sim.navigator.distance(
        data.activities[i], data.activities[nexti])
    }

    const totalTravelTicks = data.travelTicks.reduce((val, x) => val + x, 0)

    // Number of ticks left for activities
    let activityTicks = this.sim.config.ticks.day
      - data.activityTicks[0] - totalTravelTicks

    // Make sure there's time for at least one tick at each activity location.
    if (activityTicks < data.activities.length - 1) {
      activityTicks = data.activities.length - 1
    }

    const travelTimeRemaining = this.sim.config.ticks.day
      - data.activityTicks[0] - activityTicks

    // Randomly assign amount of ticks to stay at each activity.  Skip activity
    // zero, which is home.
    for (let i = 1; i < data.activityTicks.length; i++) {
      const remaining = data.activityTicks.length - i - 1

      // Minimum of one tick, maximum of remaining ticks, leaving room for
      // remaining activities.
      data.activityTicks[i] = this.sim.rng.integer(1, activityTicks - remaining)

      activityTicks -= data.activityTicks[0]
    }

    // If there's not enough time to visit each node between two locations, the
    // agent will have to skip some.
    if (travelTimeRemaining < totalTravelTicks) {
      const ticksToRemove = Math.ceil((totalTravelTicks - travelTimeRemaining) / 4)

      for (let i = 0; i < data.activities.length; i++) {
        data.travelTicks[i] -= ticksToRemove
      }
    }

    // Agent first becomes active when it's time to leave home.
    data.becomeActiveTick = data.activityTicks[0]

    agent.data.civilian = data

    // Agent starts at home
    agent.location = data.activities[0]
  }

  move(agent: Agent): void {
    const data: CivilianData = agent.data.civilian

    if (this.sim.tick === data.becomeActiveTick) {
      data.active = true

      // Next deadline is target's travel time
      data.becomeActiveTick = data.travelTicks[data.target]
    }

    if (!data.active) {
      return
    }

    const currentNode = agent.location
    const targetNode = data.activities[data.target]

    const distance = this.sim.navigator.distance(currentNode, targetNode)
    const deadline = data.becomeActiveTick - this.sim.tick

    // NEXT: Decide how to skip nodes

    // Move towards the current target
    const edge = this.sim.navigator.nextEdge(agent.location, targetNode)
    if (edge === undefined) {
      throw new Error(`No path to target: ${agent.id}: ${currentNode.id} -> ${targetNode.id}`)
    }
    edge.follow(agent)
  }

  action(agent: Agent): void {
    const data: CivilianData = agent.data.civilian

    if (!data.active) {
      return
    }

    const targetNode = data.activities[data.target]

    // If agent is at the target, pick a new target, and become inactive.
    if (agent.location === targetNode) {
      data.target = (data.target + 1) % data.activities.length
      data.active = false
    }
  }

}

