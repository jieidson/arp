import { Component, Input } from '@angular/core'

@Component({
  selector: 'arp-spinner',
  template: '<md-progress-spinner [mode]="mode" [value]="value"></md-progress-spinner>',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {

  @Input() progress: number | null

  get mode(): string {
    return this.progress === null ? 'indeterminate' : 'determinate'
  }

  get value(): number {
    return this.progress === null ? 0 : this.progress
  }

}
