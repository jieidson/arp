import { NgModule }         from '@angular/core'

import { AppComponent } from './app.component'
import { SharedModule } from './shared/shared.module'

@NgModule({
  imports: [
    SharedModule.forRoot(),
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
