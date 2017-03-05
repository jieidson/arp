import { Agent } from './agent'

export interface Behavior {
  init(agent: Agent): void
}
