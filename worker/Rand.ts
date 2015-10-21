declare var Random: any;

class Rand {

  private static engine: any;

  static init(): void {
    Rand.engine = Random.engines.nativeMath;
  }

  static integer(min: number, max: number): number {
    return Random.integer(min, max)(Rand.engine);
  }

  static pick(list: any[]): any {
    return Random.pick(Rand.engine, list);
  }

}
