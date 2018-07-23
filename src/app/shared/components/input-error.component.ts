import { ChangeDetectionStrategy, Component, Host, OnInit } from '@angular/core'
import { MatFormField } from '@angular/material'

import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent implements OnInit {

  constructor(
    @Host() private readonly field: MatFormField,
  ) {}

  error$!: Observable<string>

  ngOnInit(): void {
    // This is a bit of a hack.  If this field ever goes away, we'll probably
    // need to go back to manually specifiying the control name.
    const control = this.field._control.ngControl

    if (!control || !control.statusChanges) {
      throw new Error('field has no attached control')
    }

    const getError = () => {
      if (!control.errors) {
        return ''
      }
      return Object.keys(control.errors)[0]
    }

    this.error$ = control.statusChanges.pipe(
      map(() => getError()),
      startWith(getError()),
    )
  }

}
