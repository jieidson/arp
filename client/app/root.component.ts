import {
  AfterViewInit, ChangeDetectionStrategy, Component, ViewChild,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatAccordion } from '@angular/material'

import { SimulatorService } from './shared/services/simulator.service'

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: [
    '../styles/form-block.scss',
    './root.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent implements AfterViewInit {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly simulatorService: SimulatorService,
  ) {}

  @ViewChild(MatAccordion) readonly accordion!: MatAccordion

  allOpen = true

  form = this.formBuilder.group({
    agents: this.formBuilder.group({
      police: [200, Validators.required],
      civilians: [800, Validators.required],
      offenders: [200, Validators.required],
    }),
  })

  ngAfterViewInit(): void {
    // Need to do this in the next turn of the change
    Promise.resolve().then(() => this.accordion.openAll())

    console.log('FORM:', this.form)
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
    console.log('CLICK')
    this.simulatorService.start()
    this.simulatorService.run()
  }

}
