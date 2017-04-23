import { Injectable } from '@angular/core'

import { Config } from '../../../sim/config'

declare function require(id: string): any

// tslint:disable-next-line:no-var-requires
const SimWorker = require('worker-loader!../../../sim/main')

@Injectable()
export class RunnerService {

  private worker: Worker

  start(config: Config): void {
    this.worker = new SimWorker()
    this.worker.addEventListener('message', msg => console.log('From worker:', msg))
    this.worker.addEventListener('error', err => console.log('Worker error:', err))
    this.worker.postMessage({ type: 'start', config })
  }

}
