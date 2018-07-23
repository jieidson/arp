import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

console.info('commit:', environment.version.commit)
console.info('branch:', environment.version.branch)
console.info('version:', environment.version.tag)
console.info('environment:', environment.name)

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => document.body.classList.remove('app-loading'))
  .catch(err => console.error('Angular bootstrap error:', err))
