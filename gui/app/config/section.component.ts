import {
  ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges,
} from '@angular/core'
import { AbstractControl } from '@angular/forms'

import { EMPTY, Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

import { ConfigGroup, ConfigSection, ConfigService } from './config.service'

@Component({
  selector: 'app-config-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigSectionComponent implements OnChanges {

  constructor(
    private readonly configService: ConfigService,
  ) {}

  @Input()
  section?: ConfigSection

  typeControl: AbstractControl | null = null
  types: { id: string, label: string}[] = []

  formGroup$: Observable<AbstractControl | null> = EMPTY
  group?: ConfigGroup

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.section && this.section) {
      this.typeControl = this.configService.form.get(this.section.id + 'Type')
      this.types = this.section.groups.map(g => ({ id: g.id, label: g.label }))
      this.updateFormGroup(this.section)
    }
  }

  private updateFormGroup(section: ConfigSection): void {
    if (!this.typeControl) {
      this.formGroup$ = EMPTY
      return
    }

    this.formGroup$ = this.typeControl.valueChanges.pipe(
      startWith(this.typeControl.value),
      map(value => {
        if (this.section) {
          this.group = this.section.groups.find(g => g.id === value)
        }
        return this.configService.updateForm(section.id, value)
      }),
    )
  }

}
