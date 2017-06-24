// import { Simulator }    from '../simulator'
import { Agent }        from './agent'
import { Behavior }     from './behavior'
import { CivilianData } from './civilian'

export class OffenderBehavior implements Behavior {

  // constructor(private sim: Simulator) {}

  init(_: Agent): void {
    return
  }

  move(_: Agent): void {
    return
  }

  action(agent: Agent): void {
    const data: CivilianData = agent.data.civilian

    if (!data.active) {
      return
    }
  }

}
