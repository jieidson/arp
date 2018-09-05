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
  readonly form = this.configService.form
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
    if (this.form.invalid) {
      console.warn('form invalid')
      return
    }

    const config = this.configService.config

    this.allOpen = false
    this.accordion.closeAll()

    this.simulatorService.start()
    this.simulatorService.run(config)
  }

}
