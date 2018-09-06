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
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const index = row * width + column
      nodes[index] = new Node(index)
    }
  }

  const edges: Edge[] = []

  // Link them together in a grid
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const index = row * width + column
      const node = nodes[index]

      // If there is a node below this node, link it.
      if (row + 1 < height) {
        const downIndex = (row + 1) * width + column
        const downNode = nodes[downIndex]
        const edge = node.link(downNode)
        edges.push(edge)
      }

      // If there is a node to the right of this node, link it.
      if (column + 1 < width) {
        const rightIndex = row * width + (column + 1)
        const rightNode = nodes[rightIndex]
        const edge = node.link(rightNode)
        edges.push(edge)
      }
    }
  }

  return new Arena(width, height, nodes, edges)
}

export function weightedGrid(config: WeightedGridArenaConfig, rng: RNG): Arena {
  const { width, height, majorX, majorY, minorWeight, majorWeight } = config

  const nodes = new Array<Node>(width * height)

  // Construct each arena node
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const index = row * width + column
      nodes[index] = new Node(index)
    }
  }

  // Make lists for row and column indexes, so we can randomly pick some to be
  // major streets.
  const rowIndices = []
  const columnIndices = []
  for (let i = 0; i < height; i++) { rowIndices.push(i) }
  for (let i = 0; i < width; i++) { columnIndices.push(i) }

  // Chose some rows and columns to be major streets.
  const horizontalMajors = rng.sample(rowIndices, majorX)
  const verticalMajors = rng.sample(columnIndices, majorY)

  const edges: Edge[] = []

  // Link them together in a grid
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const index = row * width + column
      const node = nodes[index]

      // If there is a node below this node, link it.
      if (row + 1 < height) {
        const downIndex = (row + 1) * width + column
        const downNode = nodes[downIndex]

        // If this column is a major street, set its weight appropriately.
        let weight = minorWeight
        if (verticalMajors.indexOf(column) !== -1) {
          weight = majorWeight
        }

        const edge = node.link(downNode, weight)

        edges.push(edge)
      }

      // If there is a node to the right of this node, link it.
      if (column + 1 < width) {
        const rightIndex = row * width + (column + 1)
        const rightNode = nodes[rightIndex]

        // If this row is a major street, set its weight appropriately.
        let weight = minorWeight
        if (horizontalMajors.indexOf(row) !== -1) {
          weight = majorWeight
        }

        const edge = node.link(rightNode, weight)

        edges.push(edge)
      }
    }
  }

  return new Arena(width, height, nodes, edges)
}
