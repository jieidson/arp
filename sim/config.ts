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

  civilians: {
    homeTicksMean: number,
    homeTicksDeviation: number,

    wealthMean: number,
    wealthDeviation: number,

    unemployment: number,
    hiringRate: number,
    firingRate: number,

    payRate: number,
  }

  offenders: {
    stealAmount: number,
    cooldown: number,
  }

}

export function defaultConfig(): Config {
  return {
    agents: {
      police: 200,
      civilian: 800,
      offender: 200,
    },

    arena: {
      width: 5,
      height: 5,
    },

    // 1 tick = 1 minute * 60 = 1 hour * 24 = 1 day * 364 = 1 year
    ticks: {
      day: 60 * 24,
      total: 60 * 24 * 365,
      seed: 100,
    },

    civilians: {
      homeTicksMean: 720,
      homeTicksDeviation: 144,

      wealthMean: 50,
      wealthDeviation: 20,

      unemployment: 7,
      hiringRate: 3,
      firingRate: 3,

      payRate: 5,
    },

    offenders: {
      stealAmount: 1,
      cooldown: 60,
    },
  }
}
