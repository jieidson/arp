import { Edge } from './edge'

export class Node {

  constructor(
    public readonly id: number,
  ) {}

  readonly edges: Edge[] = []

  link(node: Node, weight: number = 1): Edge {
    const edge = new Edge(this, node, weight)
    this.edges.push(edge)
    node.edges.push(edge)
    return edge
  }

}
