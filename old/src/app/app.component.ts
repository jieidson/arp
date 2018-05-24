import { Observable }   from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'

import 'rxjs/add/operator/map'

import { Component, OnDestroy, OnInit } from '@angular/core'

import { defaultConfig } from '../../sim/config'
import { ProgressMessage } from '../../sim/messages'
import { RunnerService } from './shared/runner.service'

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

  get progress$(): Observable<ProgressMessage> {
    return this.runner.progress$
  }

  start(): void {
    this.runner.start(this.config)
  }

  stop(): void {
    this.runner.kill()
  }

}
