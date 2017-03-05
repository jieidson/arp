import { Edge } from './edge'
import { Node } from './node'

export class Arena {

  nodes: Node[] = []
  edges: Edge[] = []

  static randomGrid(width: number, height: number): Arena {
    const arena = new Arena()
    arena.nodes = new Array(width * height)

    // Construct each arena node
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x
        arena.nodes[i] = new Node(i, x, y)
      }
    }

    // Link them together in a grid
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x
        const downi = (y + 1) * width + x
        const righti = y * width + (x + 1)

        const node = arena.nodes[i]

        if (y + 1 < height) {
          const downNode = arena.nodes[downi]
          arena.edges.push(node.link(downNode))
        }

        if (x + 1 < width) {
          const rightNode = arena.nodes[righti]
          arena.edges.push(node.link(rightNode))
        }
      }
    }

    return arena
  }


}
