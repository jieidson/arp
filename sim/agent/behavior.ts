import { Agent } from './agent'

export interface Behavior {
  init(agent: Agent): void
  move(agent: Agent): void
  action(agent: Agent): void
}
