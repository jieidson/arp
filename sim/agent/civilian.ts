import { Node }      from '../arena/node'
import { Simulator } from '../simulator'
import { Agent }     from './agent'
import { Behavior }  from './behavior'

export interface CivilianData {
  type: 'civilian'

  // List of locations the agent travels between.  The first one is the agent's
  // home location.
  activities: Node[]

  // An index into the activities list for the location the agent is traveling
  // towards.
  target: number

  // How many ticks to stay at each activity location.
  activityTicks: number[]

  // How many ticks the node has to get to the next activity location.
  travelTicks: number[]

  // Whether the agent is currently traveling, or busy at an activity location.
  active: boolean

  // The next tick at which this agent will become active.
  becomeActiveTick: number

  // Number of nodes to step through per move.
  travelSteps: number

  // How much money this agent has.
  wealth: number
}

export class CivilianBehavior implements Behavior {

  constructor(private sim: Simulator) {}

  init(agent: Agent): void {
    const data: CivilianData = {
      type: 'civilian',

      // Randomly choose home, and three activity locations
      activities: this.sim.rng.sample(this.sim.arena.nodes, 4),

      // Agent's target is the first activity location
      target: 1,

      activityTicks: new Array(4),
      travelTicks: new Array(4),
      active: false,
      becomeActiveTick: 0,
      travelSteps: 1,

      wealth: this.sim.rng.gaussian(
        this.sim.config.civilians.wealthMean,
        this.sim.config.civilians.wealthDeviation),
    }

    // Number of ticks to stay at home
    data.activityTicks[0] = Math.round(this.sim.rng.gaussian(
      this.sim.config.civilians.homeTicksMean,
      this.sim.config.civilians.homeTicksDeviation,
    ))

    // The maximum number of ticks an agent will need to travel to the next
    // activity location is the distance between the two locations (assuming
    // agent can travel one node per tick).
    let totalTravelTicks = data.activities
      .map((node, i) => {
        const nexti = (i + 1) % data.activities.length
        return this.sim.navigator.distance(node, data.activities[nexti])
      })
      .reduce((val, cur) => val + cur, 0)

    // Number of ticks left for everything else.
    let totalActivityTicks = this.sim.config.ticks.day - data.activityTicks[0]
      - (data.activities.length - 1)

    // If there's not enough time to travel, and spend at least one tick at each
    // activity location, skip nodes while traveling.
    while (totalActivityTicks < (totalTravelTicks / data.travelSteps)) {
      data.travelSteps += 1
    }

    // Readjust totals if we skip nodes.
    totalTravelTicks = totalActivityTicks / data.travelSteps
    totalActivityTicks = this.sim.config.ticks.day - totalTravelTicks

    for (let i = 1; i < data.activityTicks.length; i++) {
      let remaining = totalActivityTicks - data.activityTicks.length - i - 1
      // Make sure to spend at least one tick at each activity.
      if (remaining <= 1) {
        remaining = 1
      }
      data.activityTicks[i] = this.sim.rng.integer(1, remaining)
      totalActivityTicks -= data.activityTicks[i]
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
    }

    if (!data.active) {
      return
    }

    const currentNode = agent.location
    const targetNode = data.activities[data.target]

    for (let i = 0; i < data.travelSteps; i++) {
      // Move towards the current target
      const edge = this.sim.navigator.nextEdge(agent.location, targetNode)
      if (edge === undefined) {
        throw new Error(`Agent ${agent.id} - No path to target: ${currentNode.id} -> ${targetNode.id}`)
      }
      edge.follow(agent)
    }
  }

  action(agent: Agent): void {
    const data: CivilianData = agent.data.civilian

    if (this.sim.tick % (this.sim.config.ticks.day * 14)) {
      data.wealth += this.sim.config.civilians.payRate
    }

    if (!data.active) {
      return
    }

    const targetNode = data.activities[data.target]

    // If agent is at the target, pick a new target, and become inactive.
    if (agent.location === targetNode) {
      data.active = false
      data.target = (data.target + 1) % data.activities.length
      data.becomeActiveTick = this.sim.tick + data.activityTicks[data.target]
    }
  }

}

