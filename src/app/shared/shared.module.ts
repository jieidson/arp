import { CommonModule }                  from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { FlexLayoutModule }              from '@angular/flex-layout'
import { FormsModule }                   from '@angular/forms'
import { HttpModule }                    from '@angular/http'
import { BrowserModule }                 from '@angular/platform-browser'
import { BrowserAnimationsModule }       from '@angular/platform-browser/animations'
import { RouterModule }                  from '@angular/router'

import {
  MdButtonModule,
  MdCardModule,
  MdInputModule,
  MdToolbarModule,
 } from '@angular/material'

import { RunnerService } from './runner.service'

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    RouterModule,
    MdToolbarModule,
    MdInputModule,
    MdButtonModule,
    MdCardModule,
  ],
  exports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    RouterModule,
    MdToolbarModule,
    MdInputModule,
    MdButtonModule,
    MdCardModule,
  ],
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        RunnerService,
      ],
    }
  }

}
