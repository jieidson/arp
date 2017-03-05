export class Arena {

  static randomGrid(width: number, height: number): Arena {
    const nodes: Node[] = new Array(width * height)
    for (let i = 0; i < nodes.length; i++) {
      nodes[i] = new Node(i)
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x
        const downi = (y + 1) * width + x
        const righti = y * width + (x + 1)

        const node = nodes[i]

        if (y + 1 < height) {
          const downNode = nodes[downi]
          node.link(downNode)
        }

        if (x + 1 < width) {
          const rightNode = nodes[righti]
          node.link(rightNode)
        }
      }
    }

    return new Arena(nodes)
  }

  constructor(
    public nodes: Node[],
  ) {}

}

export class Node {

  edges: Set<Edge> = new Set()
  agents: Set<Agent> = new Set()

  constructor(
    public id: number,
  ) {}

  link(node: Node): void {
    const edge = new Edge(this, node)
    this.edges.add(edge)
    node.edges.add(edge)
  }

  enter(agent: Agent): void {
    this.agents.add(agent)
    agent.location = this
  }

  leave(agent: Agent): void {
    this.agents.delete(agent)
    agent.location = null
  }

}

export class Edge {

  constructor(
    public left: Node,
    public right: Node,
  ) {}

}

export class Agent {

  public location: Node | null = null

  constructor(
    public id: number,
    public home: Node,
    public work: Node,
  ) {}

}
