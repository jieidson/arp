import { Component } from '@angular/core'

import { RunnerService } from './shared/runner.service'

import { defaultConfig } from '../../sim/config'

@Component({
  selector: 'arp-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  config = defaultConfig()

  constructor(
    private runner: RunnerService,
  ) {}

  start(): void {
    this.runner.start(this.config)
  }

}
