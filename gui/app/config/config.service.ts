import { Injectable } from '@angular/core'
import {
  FormBuilder, FormGroup, ValidatorFn, Validators,
} from '@angular/forms'

import { Config } from '@arp/shared'

import { equalsValidator, maxValue, sumEqual } from '../shared/utils/validators'

export interface ConfigSection {
  id: string
  title: string
  groups: ConfigGroup[]
}

export interface ConfigGroup {
  id: string
  label: string
  controls?: ConfigControl[]
  validators?: ValidatorFn | ValidatorFn[]
}

export interface ConfigControl {
  id: string
  type: 'number'
  placeholder: string
  default: any
  validators: ValidatorFn | ValidatorFn[]
}

const SECTIONS: ConfigSection[] = [
  {
    id: 'rng',
    title: 'Random Number Generator',
    groups: [
      {
        id: 'mersenne-twister',
        label: 'Mersenne Twister',
        controls: [
          {
            id: 'seed',
            type: 'number',
            placeholder: 'Seed',
            default: 1234,
            validators: Validators.required,
          },
        ],
      },
    ],
  },
  {
    id: 'time',
    title: 'Time',
    groups: [
      {
        id: 'days',
        label: 'Ticks/Day',
        controls: [
          {
            id: 'ticksPerDay',
            type: 'number',
            placeholder: 'Ticks Per Day',
            default: 1440, // 60 minutes in hour * 24 hours
            validators: [Validators.required, Validators.min(1)],
          },
          {
            id: 'totalDays',
            type: 'number',
            placeholder: 'Total Days',
            default: 30,
            validators: [Validators.required, Validators.min(1)],
          },
        ],
      },
    ],
  },
  {
    id: 'arena',
    title: 'Arena',
    groups: [
      {
        id: 'weighted-grid',
        label: 'Weighted Grid',
        controls: [
          {
            id: 'width',
            type: 'number',
            placeholder: 'Width',
            default: 5,
            validators: [Validators.required, Validators.min(1)],
          },
          {
            id: 'height',
            type: 'number',
            placeholder: 'Height',
            default: 5,
            validators: [Validators.required, Validators.min(1)],
          },
          {
            id: 'majorX',
            type: 'number',
            placeholder: 'Horizontal Major Streets',
            default: 2,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'majorY',
            type: 'number',
            placeholder: 'Vertical Major Streets',
            default: 2,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'minorWeight',
            type: 'number',
            placeholder: 'Minor Street Weight',
            default: 5,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'majorWeight',
            type: 'number',
            placeholder: 'Major Street Weight',
            default: 1,
            validators: [Validators.required, Validators.min(0)],
          },
        ],
        validators: [
          maxValue('majorX', 'width'),
          maxValue('majorY', 'height'),
        ],
      },
    ],
  },
  {
    id: 'moral',
    title: 'Moral Context',
    groups: [
      {
        id: 'major-minor',
        label: 'Major/Minor Streets',
        controls: [
          {
            id: 'majorMajor',
            type: 'number',
            placeholder: 'Major/Major Intersection %',
            default: 60,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'majorMinor',
            type: 'number',
            placeholder: 'Major/Minor Intersection %',
            default: 20,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'minorMinor',
            type: 'number',
            placeholder: 'Minor/Minor Intersection %',
            default: 20,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'radiusMean',
            type: 'number',
            placeholder: 'Radius Mean',
            default: 0,
            validators: [
              Validators.required,
              Validators.min(0),
            ],
          },
          {
            id: 'radiusStdDev',
            type: 'number',
            placeholder: 'Radius Std. Dev.',
            default: 0,
            validators: [
              Validators.required,
              Validators.min(0),
            ],
          },
        ],
        validators: [
          sumEqual(100, 'majorMajor', 'majorMinor', 'minorMinor'),
        ],
      },
    ],
  },
  {
    id: 'agent',
    title: 'Agent Distribution',
    groups: [
      {
        id: 'normal',
        label: 'Civilan/Offender/Police',
        controls: [
          {
            id: 'civilian',
            type: 'number',
            placeholder: 'Civilians',
            default: 8,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'offender',
            type: 'number',
            placeholder: 'Offenders',
            default: 2,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'police',
            type: 'number',
            placeholder: 'Police',
            default: 2,
            validators: [Validators.required, Validators.min(0)],
          },
        ],
      },
    ],
  },
  {
    id: 'activity',
    title: 'Activities',
    groups: [
      {
        id: 'activity',
        label: 'Home + Activities',
        controls: [
          {
            id: 'sleepMean',
            type: 'number',
            placeholder: 'Sleep Ticks Mean',
            default: 720,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'sleepStdDev',
            type: 'number',
            placeholder: 'Sleep Ticks Std. Dev.',
            default: 144,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'countMean',
            type: 'number',
            placeholder: 'Activity Location Count Mean',
            default: 1,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'countStdDev',
            type: 'number',
            placeholder: 'Activity Location Count Std. Dev.',
            default: 2,
            validators: [Validators.required, Validators.min(0)],
          },
        ],
      },
    ],
  },
  {
    id: 'workspace',
    title: 'Workspace',
    groups: [
      {
        id: 'major-minor-moral',
        label: 'Major/Minor Streets w/Morals',
        controls: [
          {
            id: 'majorMajorLow',
            type: 'number',
            placeholder: 'Major/Major Low Morals',
            default: 15,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'majorMajorHigh',
            type: 'number',
            placeholder: 'Major/Major High Morals',
            default: 20,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'majorMinorLow',
            type: 'number',
            placeholder: 'Major/Minor Low Morals',
            default: 15,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'majorMinorHigh',
            type: 'number',
            placeholder: 'Major/Minor High Morals',
            default: 20,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'minorMinorLow',
            type: 'number',
            placeholder: 'Minor/Minor Low Morals',
            default: 10,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'minorMinorHigh',
            type: 'number',
            placeholder: 'Minor/Minor High Morals',
            default: 20,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
        ],
        validators: [sumEqual(100, 'majorMajorLow', 'majorMajorHigh',
          'majorMinorLow', 'majorMinorHigh', 'minorMinorLow',
          'minorMinorHigh')],
      },
    ],
  },
  {
    id: 'economy',
    title: 'Economy',
    groups: [
      {
        id: 'employment',
        label: 'Employment',
        controls: [
          {
            id: 'unemployment',
            type: 'number',
            placeholder: 'Initial Unemployment Rate',
            default: 7,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'hiringRate',
            type: 'number',
            placeholder: 'Hiring Rate per Year',
            default: 3,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'firingRate',
            type: 'number',
            placeholder: 'Firing Rate per Year',
            default: 3,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'wealthMean',
            type: 'number',
            placeholder: 'Initial Wealth Mean',
            default: 50,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'wealthStdDev',
            type: 'number',
            placeholder: 'Initial Wealth Std. Dev.',
            default: 20,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'payRate',
            type: 'number',
            placeholder: 'Income per Pay Period',
            default: 5,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'payPeriod',
            type: 'number',
            placeholder: 'Ticks of Pay Period',
            default: 20160, // 60 seconds * 24 hours * 14 days
            validators: [Validators.required, Validators.min(0)],
          },
        ],
      },
    ],
  },
  {
    id: 'offender',
    title: 'Offender Behavior',
    groups: [
      {
        id: 'offender',
        label: 'Robber',
        controls: [
          {
            id: 'amount',
            type: 'number',
            placeholder: 'Amount taken per robbery',
            default: 1,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'cooldown',
            type: 'number',
            placeholder: 'Robbery cooldown',
            default: 60,
            validators: [Validators.required, Validators.min(0)],
          },
        ],
      },
    ],
  },
]

@Injectable({ providedIn: 'root' })
export class ConfigService {

  constructor(
    private readonly formBuilder: FormBuilder,
  ) {}

  readonly sections = SECTIONS

  readonly form = this.makeFormGroup()

  get config(): Config {
    const config: any = {}

    for (const section of this.sections) {
      const typeControl = this.form.get(section.id + 'Type')
      if (!typeControl) { throw new Error('no type control') }

      const valueControl = this.form.get(section.id)
      if (!valueControl) { throw new Error('no value control') }

      config[section.id] = {
        type: typeControl.value,
        ...valueControl.value,
      }
    }

    return config
  }

  updateForm(sectionID: string, groupID: string): FormGroup {
    const typeControl = this.form.get(sectionID + 'Type')
    if (!typeControl) { throw new Error('no type control') }

    this.form.removeControl(sectionID)

    const section = this.sections.find(s => s.id === sectionID)
    if (!section) { throw new Error('no section') }

    const group = section.groups.find(g => g.id === groupID)
    if (!group) { throw new Error('no group') }

    let controls: ConfigControl[] = []

    if (group.controls) {
      controls = group.controls
    }

    const config: { [key: string]: any } = {}

    for (const control of controls) {
      config[control.id] = [control.default, control.validators]
    }

    const extra = group.validators ? { validator: group.validators } : null

    const formGroup = this.formBuilder.group(config, extra)
    this.form.addControl(sectionID, formGroup)
    return formGroup
  }

  private makeFormGroup(): FormGroup {
    const config: { [key: string]: any } = {}

    for (const section of this.sections) {
      const typeIDs = section.groups.map(g => g.id)
      if (typeIDs.length === 0) { throw new Error('no type values') }

      const typeConfig = [typeIDs[0], [
        Validators.required,
        equalsValidator(...typeIDs),
      ]]

      config[section.id + 'Type'] = typeConfig
    }

    return this.formBuilder.group(config)
  }

}
