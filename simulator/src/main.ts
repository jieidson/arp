import { Messenger } from './messenger'
import { Simulator } from './simulator'

console.info('simulator web worker started')

const messenger = new Messenger()
addEventListener('message', evt => messenger.onMessage(evt))

const simulator = new Simulator(
  messenger,
)

simulator.start()
