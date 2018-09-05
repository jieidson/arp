import { Injectable } from '@angular/core'

import { Observable, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

import { ArenaData, Command, Config, Event, isReadyEvent } from '@arp/shared'

const WORKER_PATH = './assets/simulator.js'

@Injectable({ providedIn: 'root' })
export class SimulatorService {

  private readonly eventSubject = new Subject<Event>()

  private worker?: Worker

  readonly events$: Observable<Event> = this.eventSubject.asObservable()
  readonly arena$: Observable<ArenaData> = this.events$
    .pipe(
      filter(isReadyEvent),
      map(evt => evt.arena),
    )

  start(): void {
    if (this.worker) {
      this.stop()
    }

    console.info('Starting worker...')
    this.worker = new Worker(WORKER_PATH)
    this.worker.addEventListener('message', evt => this.onWorkerMessage(evt))
    this.worker.addEventListener('error', evt => this.onWorkerError(evt))
  }

  stop(): void {
    if (!this.worker) {
      return
    }

    this.worker.terminate()
    delete this.worker
  }

  run(config: Config): void {
    this.send({ type: 'run', config })
  }

  private send(cmd: Command): void {
    if (!this.worker) {
      throw new Error('simulator not started')
    }

    this.worker.postMessage(cmd)
  }

  private onWorkerMessage(messageEvent: MessageEvent): void {
    const evt: Event = messageEvent.data
    console.log('simulator event:', evt)
    this.eventSubject.next(evt)
  }

  private onWorkerError(evt: ErrorEvent): void {
    console.error('Simulator error:', evt)
  }

}
