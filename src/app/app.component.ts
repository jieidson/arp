import 'rxjs/add/operator/map'

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

  get progress$(): Observable<number> {
    return this.runner.progress$.map(msg => msg.percent)
  }

  get status$(): Observable<string> {
    return this.runner.progress$.map(msg => msg.status)
  }

  start(): void {
    this.runner.start(this.config)
  }

}
