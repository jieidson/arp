class Agent {

  name: string;
  node: ArenaNode;

  constructor(name: string, node: ArenaNode) {
    this.name = name;
    this.node = node;

    this.node.enter(this);
  }

  tick(): void {
    var edge = Rand.pick(this.node.edges);
    this.follow(edge);
  }

  follow(edge: ArenaEdge): void {
    this.node.leave(this);
    this.node = this.node.follow(edge);
    this.node.enter(this);
  }

}
