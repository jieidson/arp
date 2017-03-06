import { Subject } from 'rxjs/Subject'

import { Event } from './event'

export class Dispatcher {

  event$ = new Subject<Event>()

}
