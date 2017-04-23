import { Injectable } from '@angular/core'

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable }      from 'rxjs/Observable'

import { Config } from '../../../sim/config'

declare function require(id: string): any

// tslint:disable-next-line:no-var-requires
const SimWorker = require('worker-loader!../../../sim/main')

@Injectable()
export class RunnerService {

  get running$(): Observable<boolean> {
    return this.runningSubject
  }

  private runningSubject = new BehaviorSubject<boolean>(false)
  private worker: Worker

  constructor() {
    this.worker = new SimWorker()
    this.worker.addEventListener('message', evt => this.onWorkerMessage(evt))
    this.worker.addEventListener('error', evt => this.onWorkerError(evt))
  }

  start(config: Config): void {
    this.worker.postMessage({ type: 'start', config })
  }

  private onWorkerMessage(evt: MessageEvent): void {
    console.log('from worker:', evt.data)
    switch (evt.data.type) {
      case 'started':
        this.runningSubject.next(true)
        break

      case 'finished':
        this.runningSubject.next(false)
        break

      default:
        console.error('unexpected worker event type')
    }
  }

  private onWorkerError(evt: ErrorEvent): void {
    console.error('Worker error:', evt)
  }

}
