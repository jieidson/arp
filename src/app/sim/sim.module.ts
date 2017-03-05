import { ModuleWithProviders, NgModule } from '@angular/core'

import { RunnerService } from './runner.service'

@NgModule()
export class SimModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SimModule,
      providers: [
        RunnerService,
      ],
    }
  }

}
