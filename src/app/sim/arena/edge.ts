import { Node } from './node'

export class Edge {

  weight = 1

  constructor(
    public left: Node,
    public right: Node,
  ) {}

}
