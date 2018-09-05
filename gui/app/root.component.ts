import {
  AfterViewInit, ChangeDetectionStrategy, Component, ViewChild,
} from '@angular/core'
import { MatAccordion } from '@angular/material'

import { SimulatorService } from './shared/services/simulator.service'

import { ConfigService } from './config/config.service'

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent implements AfterViewInit {

  constructor(
    private readonly configService: ConfigService,
    private readonly simulatorService: SimulatorService,
  ) {}

  @ViewChild(MatAccordion) readonly accordion!: MatAccordion

  readonly groups = this.configService.groups
  readonly arena$ = this.simulatorService.arena$

  allOpen = true

  ngAfterViewInit(): void {
    // Need to do this in the next turn of the change detector
    Promise.resolve().then(() => this.accordion.openAll())
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
    // if (this.form.invalid) {
    //   console.warn('form invalid')
    //   return
    // }

    // const value = this.form.value

    // const config: Config = {
    //   rng: {
    //     type: value.rngType,
    //     ...value.rng,
    //   },
    //   arena: {
    //     type: value.arenaType,
    //     ...value.arena,
    //   },
    // }

    // this.allOpen = false
    // this.accordion.closeAll()

    // this.simulatorService.start()
    // this.simulatorService.run(config)
  }

  // private updateArena(): void {
  //   const typeControl = this.form.get('arenaType')
  //   if (!typeControl) { throw new Error('no arena type control') }

  //   this.form.removeControl('arena')
  //   switch (typeControl.value) {
  //     case 'simple-grid':
  //       this.form.addControl('arena', this.formBuilder.group({
  //         width: [5, [Validators.required, Validators.min(0)]],
  //         height: [5, [Validators.required, Validators.min(0)]],
  //       }))
  //       break

  //     case 'weighted-grid':
  //       this.form.addControl('arena', this.formBuilder.group({
  //         width: [5, [Validators.required, Validators.min(0)]],
  //         height: [5, [Validators.required, Validators.min(0)]],

  //         majorX: [2, [Validators.required, Validators.min(0)]],
  //         majorY: [2, [Validators.required, Validators.min(0)]],

  //         minorWeight: [5, [Validators.required, Validators.min(0)]],
  //         majorWeight: [1, [Validators.required, Validators.min(0)]],
  //       }))
  //       break

  //     default:
  //       throw new Error('invalid RNG type')
  //   }
  // }

}
