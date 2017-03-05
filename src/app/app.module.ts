import { NgModule }         from '@angular/core'

import { AppComponent } from './app.component'
import { SharedModule } from './shared/shared.module'
import { SimModule }    from './sim/sim.module'

@NgModule({
  imports: [
    SharedModule.forRoot(),
    SimModule.forRoot(),
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
