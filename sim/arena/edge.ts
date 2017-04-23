import { Agent } from '../agent/agent'
import { Node }  from './node'

export class Edge {

  weight = 1

  constructor(
    public left: Node,
    public right: Node,
  ) {}

  follow(agent: Agent) {
    const loc = agent.location

    if (loc === this.left) {
      this.left.leave(agent)
      this.right.enter(agent)

    } else if (loc === this.right) {
      this.right.leave(agent)
      this.left.enter(agent)

    } else {
      throw new Error('agent not on path')
    }
  }

}
