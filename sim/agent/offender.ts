import { Simulator }    from '../simulator'
import { Agent }        from './agent'
import { Behavior }     from './behavior'
import { CivilianData } from './civilian'

export interface OffenderData {
  type: 'offender'

  // Whether this agent robbed this tick.
  offended: boolean

  // Number of ticks agent must wait before being able to offend again.
  offendCooldown: number
}

export class OffenderBehavior implements Behavior {

  constructor(private sim: Simulator) {}

  init(agent: Agent): void {
    const data: OffenderData = {
      type: 'offender',
      offended: false,
      offendCooldown: 0,
    }

    agent.data.offender = data
  }

  move(agent: Agent): void {
    const data: OffenderData = agent.data.offender

    // Reset the offender flag
    data.offended = false

    if (data.offendCooldown > 0) {
      data.offendCooldown -= 1
    }
  }

  action(agent: Agent): void {
    const civilianData: CivilianData = agent.data.civilian

    if (!civilianData.active) {
      return
    }

    const targets = this.gatherTargets(agent)
    if (targets.length === 0) {
      // No valid targets, can't offend.
      return
    }

    const guardianship = this.calculateGuardianship(targets)
    if (guardianship > 1) {
      // Guardianship too high, don't offend.
      return
    }

    const target = this.findTarget(targets)
    const suitability = this.calculateSuitability(agent, target)
    if (suitability < 0) {
      // Suitibility too low, don't offend.
      return
    }

    const targetData: CivilianData = agent.data.civilian
    if (targetData.wealth <= 0) {
      // No money to rob, don't offend.
      return
    }

    // Robbery!
    this.offend(agent, target)
  }

  private gatherTargets(agent: Agent): Agent[] {
    const targets: Agent[] = []

    for (const other of agent.location.agents) {
      // Can't target ourselves
      if (agent === other) {
        continue
      }

      // If there's police at this location, we can't offend.
      if (other.data.police) {
        return []
      }

      // If someone else already offended here, we can't.
      const otherOffenderData: OffenderData = other.data.offender
      if (otherOffenderData && otherOffenderData.offended) {
        return []
      }

      // Can only rob active agents
      const otherCivilianData: CivilianData = other.data.civilian
      if (otherCivilianData.active) {
        targets.push(other)
      }
    }

    return targets
  }

  /**
   * The formula for guardianship is: G = ((NA – 2) + PG)
   * Where
   *   G = Guardianship.
   *   NA = Number of active agents (not at home, not at work) at the node.
   *   PG = Perception of capability of guardians who are present (random number
   *        selected between -2 and 2)
   *
   * If guardianship value (G) is greater than 1, do not offend.
   * If guardianship value (G) is less than or equal to 1, move to 2c below
   */
  private calculateGuardianship(targets: Agent[]): number {
    return (targets.length - 2) + this.sim.rng.integer(-2, 2)
  }

  /** Finds the wealthiest target. */
  private findTarget(targets: Agent[]): Agent {
    let maxWealth = -1
    let maxTarget: Agent = targets[0]

    for (const target of targets) {
      const data: CivilianData = target.data.civilian
      if (data.wealth > maxWealth) {
        maxWealth = data.wealth
        maxTarget = target
      }
    }
    return maxTarget
  }

  /**
   * The formula for suitability is: S = (WT) – (WA) + PS
   * Where
   *   S = Suitability
   *   WT = Wealth of target, in units
   *   WA = Wealth of active agent (potential; offender), in units
   *   PS = Offender perception of target suitability (random number selected
   *        between -1 and 1)
   *
   * If suitability value (S) is less than 0, do not offend
   * If suitability value (S) is greater than or equal to 0, move to 2d below
   */
  private calculateSuitability(offender: Agent, target: Agent): number {
    const agentData: CivilianData = offender.data.civilian
    const targetData: CivilianData = target.data.civilian

    return targetData.wealth - agentData.wealth + this.sim.rng.integer(-1, 1)
  }

  private offend(agent: Agent, target: Agent): void {
    const civilianData: CivilianData = agent.data.civilian
    const offenderData: OffenderData = agent.data.offender
    const targetData: CivilianData = agent.data.civilian

    const amount = Math.min(this.sim.config.offenders.stealAmount, targetData.wealth)
    targetData.wealth -= amount
    civilianData.wealth += amount

    offenderData.offended = true
    offenderData.offendCooldown = this.sim.config.offenders.cooldown

    this.sim.recorder.robbery(agent, target)
  }

}
