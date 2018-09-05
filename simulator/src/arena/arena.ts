import { SimpleGridArenaConfig, WeightedGridArenaConfig } from '@arp/shared'

import { RNG } from '../rng'
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

export function simpleGrid(config: SimpleGridArenaConfig): Arena {
  const { width, height } = config

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

export function weightedGrid(config: WeightedGridArenaConfig, rng: RNG): Arena {
  const arena = simpleGrid({
    type: 'simple-grid',
    width: config.width,
    height: config.height,
  })

  // Set all edge weights to our minor street weight to start.
  for (const edge of arena.edges) {
    edge.weight = config.minorWeight
  }

  // Make arrays for row and column indexes, so we can randomly pick some to be
  // major streets.
  const rowIndices = []
  const columnIndices = []

  for (let i = 0; i < arena.height; i++) { rowIndices.push(i) }
  for (let i = 0; i < arena.width; i++) { columnIndices.push(i) }

  // Chose some rows and columns to be major streets.
  const horizontalMajors = rng.sample(rowIndices, config.majorX)
  const verticalMajors = rng.sample(columnIndices, config.majorY)

  // Find the edges of each major street.
  for (const row of horizontalMajors) {
    for (let column = 0; column < arena.width; column++) {
      const i = row * arena.width + column

      if (column + 1 < arena.width) {
        const righti = row * arena.width + (column + 1)

        const node = arena.nodes[i]
        const rightNode = arena.nodes[righti]

        for (const edge of node.edges) {
          if (edge.left === node && edge.right === rightNode
              || edge.left === rightNode && edge.right === node) {
            edge.weight = config.majorWeight
          }
        }
      }
    }
  }

  for (const column of verticalMajors) {
    for (let row = 0; row < arena.height; row++) {
      const i = row * arena.width + column

      if (row + 1 < arena.height) {
        const downi = (row + 1) * arena.width + column

        const node = arena.nodes[i]
        const downNode = arena.nodes[downi]

        for (const edge of node.edges) {
          if (edge.left === node && edge.right === downNode
              || edge.left === downNode && edge.right === node) {
            edge.weight = config.majorWeight
          }
        }
      }
    }
  }

  return arena
}
