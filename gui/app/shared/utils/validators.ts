import { ValidatorFn, AbstractControl } from '@angular/forms'

export function equalsValidator<T>(...values: T[]): ValidatorFn {
  return control => {
    if (values.indexOf(control.value) === -1) {
      return { equals: true }
    }
    return null
  }
}

export function maxValue(valuePath: string | (string | number)[], maxPath: string | (string | number)[]): ValidatorFn {
  return control => {
    const valueControl = control.get(valuePath)
    if (!valueControl) { return null }

    const maxControl = control.get(maxPath)
    if (!maxControl) { return null }

    const value = Number.parseFloat(valueControl.value)
    const max = Number.parseFloat(maxControl.value)

    if (isNaN(value) || isNaN(max)) {
      return null
    }

    if (value > max) {
      appendError(valueControl, 'max', {
        max: max,
        actual: control.value,
      })
    } else {
      removeError(valueControl, 'max')
    }

    return null
  }
}

export function maxSum(max: number, ...paths: (string | (string | number)[])[]): ValidatorFn {
  return control => {
    const childControls = paths
      .map(path => control.get(path))
      .filter((c: AbstractControl | null): c is AbstractControl => !!c)

    const sum = childControls
      .reduce((total, ctrl) => total + Number.parseFloat(ctrl.value), 0)

    let update: (ctrl: AbstractControl) => void
    if (sum > max) {
      update = ctrl => appendError(ctrl, 'maxSum', {
        max,
        actual: sum,
      })
    } else {
      update = ctrl => removeError(ctrl, 'maxSum')
    }

    childControls.forEach(update)

    return null
  }
}

function appendError(ctrl: AbstractControl, key: string, value: any): void {
  let errors = ctrl.errors
  if (!errors) {
    errors = {}
  }

  errors[key] = value
  ctrl.setErrors(errors)
}

function removeError(ctrl: AbstractControl, key: string): void {
  let errors = ctrl.errors
  if (errors && errors[key]) {
    delete errors[key]
    if (Object.keys(errors).length === 0) {
      errors = null
    }
    ctrl.setErrors(errors)
  }
}
