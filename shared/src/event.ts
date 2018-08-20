export interface ReadyEvent {
  type: 'ready'
  arena: {
    width: number,
    height: number,
    nodes: {
      id: number,
    }[],
    edges: {
      left: number,
      right: number,
    }[],
  }
}

export interface ProgressEvent {
  type: 'progress'
}

export type Event = ReadyEvent | ProgressEvent
