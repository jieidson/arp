import { Observable } from 'rxjs/Observable'

import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/multicast'

import { Dispatcher } from './dispatcher'
import * as Events from './event'

export class Clock {

  tick$: Observable<Events.TickEvent>
  movement$: Observable<Events.MovementEvent>
  action$: Observable<Events.MovementEvent>

  private count = 0

  constructor(private dispatcher: Dispatcher) {
    this.tick$ = this.dispatcher.event$
      .filter(evt => evt.type === 'tick')

    this.movement$ = this.dispatcher.event$
      .filter(evt => evt.type === 'movement')

    this.action$ = this.dispatcher.event$
      .filter(evt => evt.type === 'action')
  }

  tick() {
    const c = this.count++

    this.dispatcher.event$.next({
      type: 'tick',
      count: c,
    })

    this.dispatcher.event$.next({
      type: 'movement',
      count: c,
    })

    this.dispatcher.event$.next({
      type: 'action',
      count: c,
    })
  }

}
