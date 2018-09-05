import { Injectable } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { equalsValidator } from '../shared/utils/validators'

export interface ConfigGroup {
  name: string
  title: string

  types: { name: string, value: string }[]
  controls: { [name: string]: ConfigControl[] }
}

export interface ConfigControl {
  name: string
  type: 'number'
  placeholder: string
  default: any
}

@Injectable({ providedIn: 'root' })
export class ConfigService {

  constructor(
    private readonly formBuilder: FormBuilder,
  ) {}

  readonly groups: ConfigGroup[] = [
    {
      name: 'rng',
      title: 'Random Number Generator',
      types: [
        { name: 'Mersenne Twister', value: 'mersenne-twister' },
        { name: 'Cryptographic RNG', value: 'crypto' },
      ],
      controls: {
        'mersenne-twister': [{
          name: 'seed',
          type: 'number',
          placeholder: 'Seed',
          default: 1234,
        }],
      },
    },
  ]

  readonly form = this.makeFormGroup()

  updateForm(name: string, value: string): void {
    const typeControl = this.form.get(name + 'Type')
    if (!typeControl) { throw new Error('no type control') }

    this.form.removeControl(name)

    const group = this.groups.find(g => g.name === name)
    if (!group) { throw new Error('no group') }

    const controls = group.controls[value]
    if (!controls) { return }

    const config: { [key: string]: any } = {}

    for (const control of controls) {
      config[control.name] = [control.default, Validators.required]
    }

    this.form.addControl(name, this.formBuilder.group(config))
  }

  private makeFormGroup(): FormGroup {
    const config: { [key: string]: any } = {}

    for (const group of this.groups) {
      const typeValues = group.types.map(t => t.value)
      if (typeValues.length === 0) { throw new Error('no type values') }

      const typeConfig = [typeValues[0], [
        Validators.required,
        equalsValidator(...typeValues),
      ]]

      config[group.name + 'Type'] = typeConfig
    }

    return this.formBuilder.group(config)
  }

}
