import { Arena } from './arena'
import { Edge }  from './edge'
import { Node }  from './node'

export class Navigator {

  // Distance matrix
  private dist: number[][]

  // Next node index in path
  private next: number[][]

  // Next edge in path
  private edgeNext: Edge[][]

  constructor(private arena: Arena) {
    this.floydWarshall()
  }

  // Returns the distance between two nodes.
  distance(from: Node, to: Node): number {
    const fromIdx = from.id
    const toIdx = to.id
    return this.dist[fromIdx][toIdx]
  }

  // Returns a path of edges from -> to.  Returns empty array if from and to are
  // the same node.  Returns null if there is no path from -> to.
  path(from: Node, to: Node): Edge[] | null {
    if (from === to) {
      return []
    }
    const fromIdx = from.id
    const toIdx = to.id

    if (this.next[fromIdx][toIdx] === undefined) {
      return null
    }

    const path = []
    let curIdx = fromIdx
    let prevIdx = fromIdx
    while (curIdx !== toIdx) {
      prevIdx = curIdx
      curIdx = this.next[curIdx][toIdx]

      path.push(this.edgeNext[prevIdx][curIdx])
    }

    return path
  }

  // Returns the next edge to travel down on the path from -> to.  Null if there
  // is no path, or if from and to are the same node.
  nextEdge(from: Node, to: Node): Edge | undefined {
    if (from === to) {
      return undefined
    }

    const edgeID = this.next[from.id][to.id]
    if (edgeID === undefined) {
      return undefined
    }

    return this.edgeNext[from.id][edgeID]
  }

  private static initDistanceMatrix(nodes: Node[]): number[][] {
    const mat = new Array(nodes.length)
    for (let i = 0; i < nodes.length; i++) {
      // The distance between every pair of nodes begins at Infinity
      mat[i] = new Array(nodes.length).fill(Infinity)

      // Except that every node is 0 away from itself
      mat[i][i] = 0
    }
    return mat
  }

  private static emptyMatrix<T>(size: number): T[][] {
    const mat = new Array(size)
    for (let i = 0; i < size; i++) {
      mat[i] = new Array(size)
    }
    return mat
  }

  // All-pairs shortest path algorithm
  // https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
  // Based on: https://github.com/cytoscape/cytoscape.js/blob/master/src/collection/algorithms/floyd-warshall.js
  private floydWarshall(): void {
    const nodes = this.arena.nodes
    const edges = this.arena.edges

    const dist = Navigator.initDistanceMatrix(nodes)
    const next = Navigator.emptyMatrix<number>(nodes.length)
    const edgeNext = Navigator.emptyMatrix<Edge>(nodes.length)

    // Record the distance between each pair of nodes that have an edge
    // between them.
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i]
      const leftID = edge.left.id
      const rightID = edge.right.id

      if (dist[leftID][rightID] > edge.weight) {
        dist[leftID][rightID] = edge.weight
        next[leftID][rightID] = rightID
        edgeNext[leftID][rightID] = edge
      }

      if (dist[rightID][leftID] > edge.weight) {
        dist[rightID][leftID] = edge.weight
        next[rightID][leftID] = leftID
        edgeNext[rightID][leftID] = edge
      }
    }

    // Build shortest-path matrix
    for (let k = 0; k < nodes.length; k++) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j]
            next[i][j] = next[i][k]
          }
        }
      }
    }

    this.dist = dist
    this.next = next
    this.edgeNext = edgeNext
  }

}
