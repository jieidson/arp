import * as rand from 'random-js'

export class Random {

  private engine: rand.Engine

  constructor(seed: number) {
    this.engine = rand.engines.mt19937().seed(seed)
  }

  pick<T>(array: Array<T>): T {
    return rand.pick(this.engine, array)
  }

  sample<T>(population: Array<T>, sampleSize: number): Array<T> {
    return rand.sample(this.engine, population, sampleSize)
  }

  gaussian(mean: number, stdev: number): number {
    const x = rand.real(0, 1, false)(this.engine)
    return mean - stdev * Math.sqrt(2) * this.ierfc(2 * x)
  }

  // Inverse complementary error function
  // From Numerical Recipes 3e p265
  private ierfc(x: number): number {
    if (x >= 2) {
      return -100
    }
    if (x <= 0) {
      return 100
    }

    const xx = (x < 1) ? x : 2 - x
    const t = Math.sqrt(-2 * Math.log(xx / 2))

    let r = -0.70711 * ((2.30753 + t * 0.27061) /
      (1 + t * (0.99229 + t * 0.04481)) - t)

    for (let j = 0; j < 2; j++) {
      const err = this.erfc(r) - xx
      r += err / (1.12837916709551257 * Math.exp(-(r * r)) - r * err)
    }

    return (x < 1) ? r : -r
  }

  // Complementary error function
  // From Numerical Recipes in C 2e p221
  erfc(x: number): number {
    const z = Math.abs(x)
    const t = 1 / (1 + z / 2)
    const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 +
      t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
      t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
      t * (-0.82215223 + t * 0.17087277)))))))))
    return x >= 0 ? r : 2 - r
  }

}
