import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ServiceWorkerModule } from '@angular/service-worker'

import { environment } from '../environments/environment'

import { SharedModule } from './shared/shared.module'

import { RootComponent } from './root.component'

@NgModule({
  declarations: [
    RootComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),

    SharedModule,
  ],
  bootstrap: [RootComponent],
})
export class AppModule {}
