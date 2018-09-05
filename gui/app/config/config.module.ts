import { NgModule } from '@angular/core'

import { SharedModule } from '../shared/shared.module'

import { ConfigGroupComponent } from './group.component'

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ConfigGroupComponent,
  ],
  declarations: [
    ConfigGroupComponent,
  ],
})
export class ConfigModule {}
