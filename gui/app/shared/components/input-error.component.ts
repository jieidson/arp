import {
  ChangeDetectionStrategy, Component, Host, Input, OnChanges, OnDestroy,
  OnInit, Optional, SimpleChanges,
} from '@angular/core'
import { AbstractControl } from '@angular/forms'
import { MatFormField } from '@angular/material'

import { Observable, Subject, Subscription } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

export interface InputValid {
  state: 'valid'
}

export interface InputError {
  state: 'error'
  type: string
  value: any
}

export type InputState = InputValid | InputError

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    @Optional() @Host() private readonly field?: MatFormField,
  ) {}

  private errorSubject = new Subject<InputState>()
  private statusSubcription?: Subscription

  @Input() control?: AbstractControl

  error$: Observable<InputState> = this.errorSubject
    .asObservable().pipe(distinctUntilChanged())

  ngOnInit(): void {
    this.update()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.control && !changes.control.firstChange) {
      this.update()
    }
  }

  ngOnDestroy(): void {
    if (this.statusSubcription) {
      this.statusSubcription.unsubscribe()
      delete this.statusSubcription
    }
  }

  update(): void {
    if (this.statusSubcription) {
      this.statusSubcription.unsubscribe()
      delete this.statusSubcription
    }

    const control = this.getControl()

    if (!control) {
      throw new Error('field has no attached control')
    }

    const postError = () => {
      let state: InputState
      if (!control.errors) {
        state = { state: 'valid' }
      } else {
        const key = Object.keys(control.errors)[0]
        state = {
          state: 'error',
          type: key,
          value: control.errors[key],
        }
      }

      this.errorSubject.next(state)
    }

    this.statusSubcription = control.statusChanges.subscribe(() => postError())
    postError()
  }

  private getControl(): AbstractControl | null {
    if (this.control) {
      return this.control
    }

    // This is a bit of a hack.  If this field ever goes away, we'll probably
    // need to go back to manually specifiying the control name.
    if (this.field && this.field._control.ngControl) {
      return this.field._control.ngControl.control
    }

    return null
  }

}
