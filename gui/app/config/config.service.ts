import { Injectable } from '@angular/core'
import {
  FormBuilder, FormGroup, ValidatorFn, Validators,
} from '@angular/forms'

import { Config } from '@arp/shared'

import { equalsValidator } from '../shared/utils/validators'

export interface ConfigGroup {
  id: string
  title: string

  types: { id: string, label: string }[]
  controls: { [id: string]: ConfigControl[] }
}

export interface ConfigControl {
  id: string
  type: 'number'
  placeholder: string
  default: any
  validators: ValidatorFn | ValidatorFn[]
}

@Injectable({ providedIn: 'root' })
export class ConfigService {

  constructor(
    private readonly formBuilder: FormBuilder,
  ) {}

  readonly groups: ConfigGroup[] = [
    {
      id: 'rng',
      title: 'Random Number Generator',
      types: [
        { id: 'mersenne-twister', label: 'Mersenne Twister' },
        { id: 'crypto', label: 'Cryptographic RNG' },
      ],
      controls: {
        'mersenne-twister': [
          {
            id: 'seed',
            type: 'number',
            placeholder: 'Seed',
            default: 1234,
            validators: Validators.required,
          },
        ],
      },
    },
    {
      id: 'arena',
      title: 'Arena',
      types: [
        { id: 'simple-grid', label: 'Simple Grid' },
        { id: 'weighted-grid', label: 'Weighted Grid' },
      ],
      controls: {
        'simple-grid': [
          {
            id: 'width',
            type: 'number',
            placeholder: 'Width',
            default: 5,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'height',
            type: 'number',
            placeholder: 'Height',
            default: 5,
            validators: [Validators.required, Validators.min(0)],
          },
        ],
        'weighted-grid': [
          {
            id: 'width',
            type: 'number',
            placeholder: 'Width',
            default: 5,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'height',
            type: 'number',
            placeholder: 'Height',
            default: 5,
            validators: [Validators.required, Validators.min(0)],
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
            default: 1,
            validators: [Validators.required, Validators.min(0)],
          },
          {
            id: 'majorWeight',
            type: 'number',
            placeholder: 'Major Street Weight',
            default: 5,
            validators: [Validators.required, Validators.min(0)],
          },
        ],
      },
    },
  ]

  readonly form = this.makeFormGroup()

  get config(): Config {
    const config: any = {}

    for (const group of this.groups) {
      const typeControl = this.form.get(group.id + 'Type')
      if (!typeControl) { throw new Error('no type control') }

      const valueControl = this.form.get(group.id)
      if (!valueControl) { throw new Error('no value control') }

      config[group.id] = {
        type: typeControl.value,
        ...valueControl.value,
      }
    }

    return config
  }

  updateForm(name: string, value: string): void {
    const typeControl = this.form.get(name + 'Type')
    if (!typeControl) { throw new Error('no type control') }

    this.form.removeControl(name)

    const group = this.groups.find(g => g.id === name)
    if (!group) { throw new Error('no group') }

    const controls = group.controls[value]
    if (!controls) { return }

    const config: { [key: string]: any } = {}

    for (const control of controls) {
      config[control.id] = [control.default, control.validators]
    }

    this.form.addControl(name, this.formBuilder.group(config))
  }

  private makeFormGroup(): FormGroup {
    const config: { [key: string]: any } = {}

    for (const group of this.groups) {
      const typeIDs = group.types.map(t => t.id)
      if (typeIDs.length === 0) { throw new Error('no type values') }

      const typeConfig = [typeIDs[0], [
        Validators.required,
        equalsValidator(...typeIDs),
      ]]

      config[group.id + 'Type'] = typeConfig
    }

    return this.formBuilder.group(config)
  }

}
