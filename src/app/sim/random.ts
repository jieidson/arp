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

}
