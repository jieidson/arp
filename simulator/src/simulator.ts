import { Messenger } from './messenger'

export class Simulator {

  constructor(
    private readonly messenger: Messenger,
  ) {}

  start(): void {
    this.messenger.commands$.subscribe(command => {
      switch (command.type) {
        case 'run':
          console.log('RUN')
          break

        default:
          console.error('unknown command type:', command.type)
      }
    })
  }

}
