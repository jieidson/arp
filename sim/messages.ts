import { Config } from './config'

export type SimMessage = StartMessage | ProgressMessage

export interface StartMessage {
  type: 'start'
  config: Config
}

export interface ProgressMessage {
  type: 'progress'
  status: string
  percent: number
}
