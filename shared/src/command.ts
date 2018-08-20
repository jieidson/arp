export interface CommandRun {
  type: 'run'
}

export interface CommandStep {
  type: 'step'
}

export type Command = CommandRun | CommandStep
