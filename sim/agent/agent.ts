import { Node }      from '../arena/node'
import { Simulator } from '../simulator'
import { Behavior }  from './behavior'

export class Agent {

  location: Node
  behaviors: Behavior[] = []

  constructor(public id: number, public sim: Simulator) {}

  init(): void {
    this.behaviors.forEach(b => b.init())
  }

}
