import * as messages from './messages'

export class Messenger {

  static send(msg: messages.SimMessage): void {
    postMessage(msg)
  }

  static progress(percent: number, status: string): void {
    Messenger.send({
      type: 'progress',
      status,
      percent,
    })
  }

}
