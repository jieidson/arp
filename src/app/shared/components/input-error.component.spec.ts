import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatFormField } from '@angular/material'

import { Subject } from 'rxjs'

import { InputErrorComponent } from './input-error.component'

class MockFormField {
  _control: { ngControl: any } = { ngControl: null }
}

describe('InputErrorComponent', () => {
  let mockFormField: MockFormField

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        declarations: [InputErrorComponent],
        providers: [
          { provide: MatFormField, useClass: MockFormField },
        ],
      })
      .compileComponents()

    mockFormField = TestBed.get(MatFormField)
  })

  it('should fail with missing control', () => {
    const fixture = TestBed.createComponent(InputErrorComponent)
    expect(() => fixture.detectChanges()).toThrow()
  })

  describe('with control', () => {
    let fixture: ComponentFixture<InputErrorComponent>
    let component: InputErrorComponent
    let nativeElement: HTMLElement

    let control: {
      errors: { [key: string]: any } | null,
      statusChanges: Subject<string>,
    }

    beforeEach(() => {
      control = {
        errors: null,
        statusChanges: new Subject<string>(),
      }
      mockFormField._control.ngControl = control

      fixture = TestBed.createComponent(InputErrorComponent)
      fixture.detectChanges()

      component = fixture.componentInstance
      nativeElement = fixture.nativeElement
    })

    it('should create', () => {
      expect(component).toBeTruthy()
    })

    it('should have no content with no errors', () => {
      expect(nativeElement.textContent)
        .toBe('')
    })

    it('should show a message on required error', () => {
      control.errors = { required: true }
      control.statusChanges.next('INVALID')
      fixture.detectChanges()

      expect(nativeElement.textContent)
        .toBe('This field is required.')
    })

    it('should show a message on email error', () => {
      control.errors = { email: true }
      control.statusChanges.next('INVALID')
      fixture.detectChanges()

      expect(nativeElement.textContent)
        .toBe('Please enter a valid email address.')
    })

    it('should show a message on match error', () => {
      control.errors = { match: true }
      control.statusChanges.next('INVALID')
      fixture.detectChanges()

      expect(nativeElement.textContent)
        .toBe('This field does not match.')
    })

    it('should clear when valid', () => {
      control.errors = { match: true }
      control.statusChanges.next('INVALID')
      fixture.detectChanges()

      control.errors = null
      control.statusChanges.next('VALID')
      fixture.detectChanges()

      expect(nativeElement.textContent)
        .toBe('')
    })
  })
})
