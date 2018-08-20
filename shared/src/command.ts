import { Config } from './config'

export interface CommandRun {
  type: 'run'
  config: Config,
}

export interface CommandStep {
  type: 'step'
}

export type Command = CommandRun | CommandStep
