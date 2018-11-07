import { NgModule } from '@angular/core'

import { SharedModule } from '../shared/shared.module'

import { ConfigSectionComponent } from './section.component'

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ConfigSectionComponent,
  ],
  declarations: [
    ConfigSectionComponent,
  ],
})
export class ConfigModule {}
