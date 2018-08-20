import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'app-loading-spinner',
  template: '<mat-spinner [diameter]="diameter"></mat-spinner>',
  styleUrls: ['./loading-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {

  @Input() diameter = 64

}
