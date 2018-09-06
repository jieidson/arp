import { Node } from './node'

export class Edge {

  constructor(
    public readonly left: Node,
    public readonly right: Node,
    public readonly weight: number,
  ) {}

}
