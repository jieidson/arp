import { ChangeDetectionStrategy, Component, Host, OnInit } from '@angular/core'
import { NgControl } from '@angular/forms'
import { MatFormField } from '@angular/material'

import { EMPTY, Observable } from 'rxjs'
import { map, startWith, tap } from 'rxjs/operators'

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent implements OnInit {

  constructor(
    @Host() private readonly field: MatFormField,
  ) {}

  type$: Observable<string> = EMPTY
  error: any = null

  ngOnInit(): void {
    const control = this.control

    if (!control || !control.statusChanges) {
      throw new Error('field has no attached control')
    }

    const getError = () => {
      if (!control.errors) {
        return ''
      }
      return Object.keys(control.errors)[0]
    }

    this.type$ = control.statusChanges.pipe(
      map(() => getError()),
      startWith(getError()),
      tap(type => {
        if (control.errors) {
          this.error = control.errors[type]
        }
      }),
    )
  }

  get control(): NgControl | null {
    // This is a bit of a hack.  If this field ever goes away, we'll probably
    // need to go back to manually specifiying the control name.
    return this.field._control.ngControl
  }

}
