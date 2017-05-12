import { Subscription } from 'rxjs/Subscription'

import 'rxjs/add/operator/map'

import { Component, OnDestroy, OnInit } from '@angular/core'

import { Observable } from 'rxjs/Observable'

import { RunnerService } from './shared/runner.service'

import { defaultConfig } from '../../sim/config'

@Component({
  selector: 'arp-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  config = defaultConfig()
  running = false

  private runningSub: Subscription

  constructor(
    private runner: RunnerService,
  ) {}

  ngOnInit(): void {
    this.runningSub = this.runner.running$.subscribe(r => this.running = r)
  }

  ngOnDestroy(): void {
    this.runningSub.unsubscribe()
  }

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

  stop(): void {
    this.runner.kill()
  }

}
