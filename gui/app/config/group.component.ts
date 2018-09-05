import {
  ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges,
} from '@angular/core'
import { AbstractControl } from '@angular/forms'

import { EMPTY, Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

import { ConfigGroup, ConfigService } from './config.service'

@Component({
  selector: 'app-config-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigGroupComponent implements OnChanges {

  constructor(
    private readonly configService: ConfigService,
  ) {}

  @Input()
  group?: ConfigGroup

  typeControl: AbstractControl | null = null
  formGroup$: Observable<AbstractControl | null> = EMPTY

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.group && this.group) {
      this.typeControl = this.configService.form.get(this.group.id + 'Type')
      this.updateFormGroup(this.group)
    }
  }

  private updateFormGroup(group: ConfigGroup): void {
    if (!this.typeControl) {
      this.formGroup$ = EMPTY
      return
    }

    this.formGroup$ = this.typeControl.valueChanges.pipe(
      startWith(this.typeControl.value),
      map(value => {
        this.configService.updateForm(group.id, value)
        return this.configService.form.get(group.id)
      }),
    )
  }

}
