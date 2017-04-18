import { Observable } from 'rxjs/Observable'

import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/multicast'

import { Dispatcher } from './dispatcher'
import * as Events from './event'

export class Clock {

  tick$: Observable<Events.TickEvent>
  movement$: Observable<Events.MovementEvent>
  action$: Observable<Events.MovementEvent>

  constructor(private dispatcher: Dispatcher) {
    this.tick$ = this.dispatcher.event$
      .filter(evt => evt.type === 'tick')

    this.movement$ = this.dispatcher.event$
      .filter(evt => evt.type === 'movement')

    this.action$ = this.dispatcher.event$
      .filter(evt => evt.type === 'action')
  }

  tick(count: number) {
    this.dispatcher.event$.next({
      type: 'tick',
      count: count,
    })

    this.dispatcher.event$.next({
      type: 'movement',
      count: count,
    })

    this.dispatcher.event$.next({
      type: 'action',
      count: count,
    })
  }

}
