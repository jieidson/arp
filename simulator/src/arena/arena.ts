import { Edge } from './edge'
import { Node } from './node'

export class Arena {

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly nodes: Node[],
    public readonly edges: Edge[],
  ) {}

}

export function basicGrid(width: number, height: number): Arena {
  const nodes = new Array<Node>(width * height)

  // Construct each arena node
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      nodes[i] = new Node(i)
    }
  }

  const edges: Edge[] = []

  // Link them together in a grid
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      const node = nodes[i]

      if (y + 1 < height) {
        const downi = (y + 1) * width + x
        const downNode = nodes[downi]
        edges.push(node.link(downNode))
      }

      if (x + 1 < width) {
        const righti = y * width + (x + 1)
        const rightNode = nodes[righti]
        edges.push(node.link(rightNode))
      }
    }
  }

  return new Arena(width, height, nodes, edges)
}
