import * as messages from './messages'

export class Messenger {

  static send(msg: messages.SimMessage, transfer?: any[]): void {
    postMessage(msg, transfer)
  }

  static progress(percent: number, status: string): void {
    Messenger.send({
      type: 'progress',
      status,
      percent,
    })
  }

  static complete(status: string, buffer: ArrayBuffer): void {
    const obj: messages.ProgressMessage = {
      type: 'progress',
      percent: 100,
      status,
      buffer,
    }
    Messenger.send(obj, [buffer])
  }

}
