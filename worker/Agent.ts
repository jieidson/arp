class Agent {

  constructor(public name: string, public x: number, public y: number) {}

  tick(): void {
    this.x += Rand.integer(-1, 1);
    this.y += Rand.integer(-1, 1);
  }

}
