import { Injectable } from '@angular/core'

import { Command, Event } from '@arp/shared'

const WORKER_PATH = './assets/simulator.js'

@Injectable({ providedIn: 'root' })
export class SimulatorService {

  private worker?: Worker

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

  run(): void {
    this.send({ type: 'run' })
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

    switch (evt.type) {
      case 'arena':
        console.log('ARENA GENERATED')
        break

      default:
        console.error('unexpected simulator event type:', evt.type)
        return
    }
  }

  private onWorkerError(evt: ErrorEvent): void {
    console.error('Simulator error:', evt)
  }

}
