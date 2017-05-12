import { Injectable } from '@angular/core'

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable }      from 'rxjs/Observable'

import { Config } from '../../../sim/config'
import * as messages from '../../../sim/messages'

declare function require(id: string): any

// tslint:disable-next-line:no-var-requires
const SimWorker = require('worker-loader!../../../sim/main')

@Injectable()
export class RunnerService {

  get running$(): Observable<boolean> {
    return this.runningSubject
  }

  get progress$(): Observable<messages.ProgressMessage> {
    return this.progressSubject
  }

  private runningSubject = new BehaviorSubject<boolean>(false)
  private progressSubject = new BehaviorSubject<messages.ProgressMessage>({
    type: 'progress',
    status: 'stopped',
    percent: 0,
  })
  private running = false

  private worker: Worker

  constructor() {
    this.worker = new SimWorker()
    this.worker.addEventListener('message', evt => this.onWorkerMessage(evt))
    this.worker.addEventListener('error', evt => this.onWorkerError(evt))
  }

  start(config: Config): void {
    this.send({ type: 'start', config })
  }

  private send(msg: messages.SimMessage): void {
    this.worker.postMessage(msg)
  }

  private onWorkerMessage(evt: MessageEvent): void {
    const msg: messages.SimMessage = evt.data
    console.log('message from sim:', msg)
    switch (msg.type) {
      case 'progress':
        const running = msg.percent > 0 && msg.percent < 100
        if (this.running !== running) {
          this.running = running
          this.runningSubject.next(running)
        }
        this.progressSubject.next(msg)
        break

      default:
        console.error('unexpected worker event type')
        break
    }
  }

  private onWorkerError(evt: ErrorEvent): void {
    console.error('Worker error:', evt)
  }

}
