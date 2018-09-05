import { Component } from '@angular/core'

import { ConfigGroup, ConfigService } from './config.service'

@Component({
  selector: 'app-config-form',
  templateUrl: './form.component.html',
})
export class ConfigFormComponent {

  constructor(
    private readonly configService: ConfigService,
  ) {}

  readonly groups = this.configService.groups

  trackGroup(_: number, item: ConfigGroup): string {
    return item.name
  }

}
