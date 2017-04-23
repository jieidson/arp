import { Simulator } from './simulator'

console.log('Web worker started')

let sim: Simulator

self.addEventListener('message', (msg: MessageEvent) => {
  console.log('From main:', msg.data)
  switch (msg.data.type) {
    case 'start':
      sim = new Simulator(msg.data.config)
      sim.start()

  }
})
