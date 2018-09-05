import { Observable, Subject } from 'rxjs'

import { Command, Event } from '@arp/shared'

export class Messenger {

  private readonly commandSubject = new Subject<Command>()

  commands$: Observable<Command> = this.commandSubject.asObservable()

  send(evt: Event): void {
    postMessage(evt)
  }

  onMessage(evt: MessageEvent): void {
    this.commandSubject.next(evt.data)
  }

}
