import { Messenger } from './messenger'
import { Simulator } from './simulator'

export function main() {
  console.info('simulator web worker started')

  const messenger = new Messenger()
  addEventListener('message', evt => messenger.onMessage(evt))

  const simulator = new Simulator(
    messenger,
  )

  simulator.start()
}

main()
