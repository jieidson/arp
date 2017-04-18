export interface Config {
  agents: {
    police: number,
    civilian: number,
    offender: number,
  }

  arena: {
    width: number,
    height: number,
  }

  ticks: {
    day: number,
    total: number,
    seed: number,
  }

}

export function defaultConfig(): Config {
  return {
    agents: {
      police: 1,
      civilian: 7,
      offender: 2,
    },

    arena: {
      width: 5,
      height: 5,
    },

    // 1 tick = 1 minute * 60 = 1 hour * 24 = 1 day * 364 = 1 year
    ticks: {
      day: 60 * 24,
      total: 60 * 24 * 365,
      seed: 12345,
    },
  }
}
