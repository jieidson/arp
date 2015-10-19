declare var Random: any;

class Rand {

  private static engine: any;

  static init(): void {
    Rand.engine = Random.engines.browserCrypto;
  }

  static integer(min: number, max: number): number {
    return Random.integer(min, max)(Rand.engine);
  }

}
