class Arena {

  nodes: ArenaNode[];

  static randomGrid(width: number, height: number): Arena {
    let nodes = new Array(width * height);
    for (let i = 0; i < nodes.length; i++) {
      nodes[i] = new ArenaNode(i);
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let i      = y * width + x,
            downi  = (y + 1) * width + x,
            righti = y * width + (x + 1);

        let node = nodes[i];

        if (y + 1 < height) {
          let downNode = nodes[downi];
          node.link(downNode);
        }

        if (x + 1 < width) {
          let rightNode = nodes[righti];
          node.link(rightNode);
        }
      }
    }

    return new Arena(nodes);
  }

  constructor(nodes: ArenaNode[]) {
    this.nodes = nodes;
  }

  toVis(): any {
    let nodes = new Array(this.nodes.length),
        edges: any = [];

    this.nodes.forEach((n) => {
      nodes[n.id] = { id: n.id, label: 'N' + n.id };

      if (n.agents.length > 0) {
        nodes[n.id].color = 'red';
      }

      n.edges.forEach((e) => {
        if (e.left.id === n.id) {
          edges.push({ from: e.left.id, to: e.right.id });
        }
      });
    });

    return { nodes: nodes, edges: edges };
  }

}

class ArenaNode {
  id: number;
  edges: ArenaEdge[] = [];
  agents: Agent[] = [];

  constructor(id: number) {
    this.id = id;
  };

  link(node: ArenaNode): void {
    let edge = new ArenaEdge(this, node);
    this.edges.push(edge);
    node.edges.push(edge);
  }

  follow(edge: ArenaEdge): ArenaNode {
    return edge.neighbor(this);
  }

  enter(agent: Agent): void {
    this.agents.push(agent);
  }

  leave(agent: Agent): void {
    var index = this.agents.indexOf(agent);
    if (index !== -1) {
      this.agents.splice(index, 1);
    }
  }
}

class ArenaEdge {
  left: ArenaNode;
  right: ArenaNode;

  constructor(left: ArenaNode, right: ArenaNode) {
    this.left = left;
    this.right = right;
  }

  // Returns the other end of an edge, given one side.
  neighbor(node: ArenaNode): ArenaNode {
    switch (node) {
      case this.left:
        return this.right;

      case this.right:
        return this.left;

      default:
        throw 'Node not on this edge!';
    }
  }
}
