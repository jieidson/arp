export type Event = TickEvent | MovementEvent | ActionEvent

export interface TickEvent {
  type: 'tick'
  count: number
}

export interface MovementEvent {
  type: 'movement'
  count: number
}

export interface ActionEvent {
  type: 'action'
  count: number
}
