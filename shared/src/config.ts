export interface Config {
  arena: ArenaConfig
}

export interface GridArenaConfig {
  type: 'grid'
  width: number
  height: number
}

export type ArenaConfig = GridArenaConfig

export function defaultConfig(): Config {
  return {
    arena: {
      type: 'grid',
      width: 5,
      height: 5,
    },
  }
}
