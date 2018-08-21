import { ValidatorFn } from '@angular/forms'

export function equalsValidator<T>(...values: T[]): ValidatorFn {
  return control => {
    if (values.indexOf(control.value) === -1) {
      return { equals: true }
    }
    return null
  }
}
