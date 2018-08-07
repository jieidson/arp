import {
  AfterViewInit, ChangeDetectionStrategy, Component, ViewChild,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatAccordion } from '@angular/material'

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
  ) {}

  private worker?: Worker

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
    if (!this.worker) {
      console.log('starting web worker')
      this.worker = new Worker('./assets/arp-simulator.umd.js')

      this.worker.addEventListener('message', evt => {
        console.log('from worker:', evt.data)
      })
    }

    this.worker.postMessage('hello from main')
  }

}
