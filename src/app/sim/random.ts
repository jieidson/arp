import * as rand from 'random-js'

export class Random {

  private engine: rand.Engine

  constructor(seed: number) {
    this.engine = rand.engines.mt19937().seed(seed)
  }

  sample<T>(population: Array<T>, sampleSize: number): Array<T> {
    return rand.sample(this.engine, population, sampleSize)
  }

}
