export interface ArenaData {
  width: number
  height: number
  nodes: { id: number }[]
  edges: {
    left: number,
    right: number,
  }[]
}

export interface ReadyEvent {
  type: 'ready'
  arena: ArenaData
}

export interface ProgressEvent {
  type: 'progress'
}

export type Event = ReadyEvent | ProgressEvent

export function isReadyEvent(evt: Event): evt is ReadyEvent {
  return evt.type === 'ready'
}
