import { Node }      from '../arena/node'
import { Behavior }  from './behavior'

export class Agent {

  location: Node
  behaviors: Behavior[] = []

  constructor(public id: number) {}

  init(): void {
    for (const b of this.behaviors) {
      b.init(this)
    }
  }

  move(): void {
    for (const b of this.behaviors) {
      b.move(this)
    }
  }

  action(): void {
    for (const b of this.behaviors) {
      b.action(this)
    }
  }

}
