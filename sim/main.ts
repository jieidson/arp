import * as messages from './messages'
import { Simulator } from './simulator'

console.log('Web worker started')

let sim: Simulator

self.addEventListener('message', (evt: MessageEvent) => {
  const msg: messages.SimMessage = evt.data
  console.log('From main:', msg)

  switch (msg.type) {
    case 'start':
      sim = new Simulator(msg.config)
      sim.start()
      break

    default:
      console.error('unexpected worker event type')
  }
})
