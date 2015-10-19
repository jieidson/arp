class Arena {

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

  constructor(public nodes: ArenaNode[]) {}

  toVis(): any {
    let nodes = new Array(this.nodes.length),
        edges: any = [];

    for (let n of this.nodes) {
      nodes[n.id] = { id: n.id, label: 'N' + n.id };

      for (let e of n.edges) {
        if (e.left.id === n.id) {
          edges.push({ from: e.left.id, to: e.right.id });
        }
      }
    }

    return { nodes: nodes, edges: edges };
  }

}

class ArenaNode {
  edges: ArenaEdge[] = [];

  constructor(public id: number) {};

  link(node: ArenaNode): void {
    let edge = new ArenaEdge(this, node);
    this.edges.push(edge);
    node.edges.push(edge);
  }
}

class ArenaEdge {
  constructor(public left: ArenaNode, public right: ArenaNode) {}
}
