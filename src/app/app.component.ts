import { Component } from '@angular/core'

import { Observable } from 'rxjs/Observable'

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

  get busy$(): Observable<boolean> {
    return this.runner.running$
  }

  start(): void {
    this.runner.start(this.config)
  }

}