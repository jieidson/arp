// BrowserAnimationsModule is only needed until MaterialModule imports it directly.
import { CommonModule }                  from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { FlexLayoutModule }              from '@angular/flex-layout'
import { FormsModule }                   from '@angular/forms'
import { HttpModule }                    from '@angular/http'
import { MaterialModule }                from '@angular/material'
import { BrowserModule }                 from '@angular/platform-browser'
import { BrowserAnimationsModule }       from '@angular/platform-browser/animations'
import { RouterModule }                  from '@angular/router'

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    RouterModule,
  ],
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [],
    }
  }

}
