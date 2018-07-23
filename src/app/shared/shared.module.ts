import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule,
  MatInputModule, MatListModule, MatProgressSpinnerModule, MatSnackBarModule,
  MatTooltipModule,
} from '@angular/material'

import { InputErrorComponent } from './components/input-error.component'
import { LoadingSpinnerComponent } from './components/loading-spinner.component'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,

    InputErrorComponent,
    LoadingSpinnerComponent,
  ],
  declarations: [
    InputErrorComponent,
    LoadingSpinnerComponent,
  ],
})
export class SharedModule {}
