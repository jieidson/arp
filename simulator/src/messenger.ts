import { Observable, Subject } from 'rxjs'

import { Command } from '@arp/shared'

export class Messenger {

  private commandSubject = new Subject<Command>()

  commands$: Observable<Command> = this.commandSubject.asObservable()

  onMessage(evt: MessageEvent): void {
    this.commandSubject.next(evt.data)
  }

}
