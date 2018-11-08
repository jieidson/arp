import { Injectable } from '@angular/core'
import {
  FormBuilder, FormGroup, ValidatorFn, Validators,
} from '@angular/forms'

import { Config } from '@arp/shared'

import { equalsValidator, maxValue, maxSum } from '../shared/utils/validators'

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
      {
        id: 'crypto',
        label: 'Cryptographic RNG',
      },
    ],
  },
  {
    id: 'arena',
    title: 'Arena',
    groups: [
      {
        id: 'simple-grid',
        label: 'Simple Grid',
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
        ],
      },
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
    id: 'morals',
    title: 'Moral Context',
    groups: [
      {
        id: 'random',
        label: 'Random',
        controls: [
          {
            id: 'lowPercent',
            type: 'number',
            placeholder: 'Low Moral Context %',
            default: 40,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(100),
            ],
          },
          {
            id: 'radiusMean',
            type: 'number',
            placeholder: 'Mean Radius',
            default: 0,
            validators: [
              Validators.required,
              Validators.min(0),
            ],
          },
          {
            id: 'radiusStdDev',
            type: 'number',
            placeholder: 'Std. Dev. of Radius',
            default: 0,
            validators: [
              Validators.required,
              Validators.min(0),
            ],
          },
        ],
      },
      {
        id: 'major-minor',
        label: 'Major/Minor Streets',
        controls: [
          {
            id: 'majorMajorPercent',
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
            id: 'majorMinorPercent',
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
            id: 'minorMinorPercent',
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
          maxSum(100, 'majorMajorPercent', 'majorMinorPercent', 'minorMinorPercent'),
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
