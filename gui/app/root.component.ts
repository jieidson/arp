import {
  AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatAccordion } from '@angular/material'

import { Subscription } from 'rxjs'

import { Config } from '@arp/shared'

import { SimulatorService } from './shared/services/simulator.service'
import { equalsValidator } from './shared/utils/validators'

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly simulatorService: SimulatorService,
  ) {}

  private rngSub?: Subscription
  private arenaSub?: Subscription

  @ViewChild(MatAccordion) readonly accordion!: MatAccordion

  readonly arena$ = this.simulatorService.arena$

  readonly form = this.formBuilder.group({
    rngType: ['mersenne-twister', [Validators.required, equalsValidator(
      'mersenne-twister', 'crypto',
    )]],

    arenaType: ['simple-grid', [Validators.required, equalsValidator(
      'simple-grid', 'weighted-grid',
    )]],
  })

  allOpen = true

  ngOnInit(): void {
    // tslint:disable:no-non-null-assertion
    this.rngSub = this.form.get('rngType')!.valueChanges
      .subscribe(() => this.updateRNG())

    this.arenaSub = this.form.get('arenaType')!.valueChanges
      .subscribe(() => this.updateArena())
    // tslint:enable:no-non-null-assertion

    this.updateRNG()
    this.updateArena()
  }

  ngAfterViewInit(): void {
    // Need to do this in the next turn of the change detector
    Promise.resolve().then(() => this.accordion.openAll())
  }

  ngOnDestroy(): void {
    if (this.rngSub) { this.rngSub.unsubscribe() }
    if (this.arenaSub) { this.arenaSub.unsubscribe() }
  }

  toggleOpen(): void {
    if (this.allOpen) {
      this.accordion.closeAll()
    } else {
      this.accordion.openAll()
    }
    this.allOpen = !this.allOpen
  }

  start(): void {
    if (this.form.invalid) {
      console.warn('form invalid')
      return
    }

    const value = this.form.value

    const config: Config = {
      rng: {
        type: value.rngType,
        ...value.rng,
      },
      arena: {
        type: value.arenaType,
        ...value.arena,
      },
    }

    this.allOpen = false
    this.accordion.closeAll()

    this.simulatorService.start()
    this.simulatorService.run(config)
  }

  private updateRNG(): void {
    const typeControl = this.form.get('rngType')
    if (!typeControl) { throw new Error('no rng type control') }

    this.form.removeControl('rng')
    switch (typeControl.value) {
      case 'mersenne-twister':
        this.form.addControl('rng', this.formBuilder.group({
          seed: [1234, Validators.required],
        }))
        break

      case 'crypto':
        this.form.addControl('rng', this.formBuilder.group({}))
        break

      default:
        throw new Error('invalid RNG type')
    }
  }

  private updateArena(): void {
    const typeControl = this.form.get('arenaType')
    if (!typeControl) { throw new Error('no arena type control') }

    this.form.removeControl('arena')
    switch (typeControl.value) {
      case 'simple-grid':
        this.form.addControl('arena', this.formBuilder.group({
          width: [5, [Validators.required, Validators.min(0)]],
          height: [5, [Validators.required, Validators.min(0)]],
        }))
        break

      case 'weighted-grid':
        this.form.addControl('arena', this.formBuilder.group({
          width: [5, [Validators.required, Validators.min(0)]],
          height: [5, [Validators.required, Validators.min(0)]],

          majorX: [2, [Validators.required, Validators.min(0)]],
          majorY: [2, [Validators.required, Validators.min(0)]],

          minorWeight: [5, [Validators.required, Validators.min(0)]],
          majorWeight: [1, [Validators.required, Validators.min(0)]],
        }))
        break

      default:
        throw new Error('invalid RNG type')
    }
  }

}
