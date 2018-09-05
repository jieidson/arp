import { NgModule } from '@angular/core'

import { SharedModule } from '../shared/shared.module'

import { ConfigFormComponent } from './form.component'
import { ConfigGroupComponent } from './group.component'

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ConfigFormComponent,
  ],
  declarations: [
    ConfigFormComponent,
    ConfigGroupComponent,
  ],
})
export class ConfigModule {}
