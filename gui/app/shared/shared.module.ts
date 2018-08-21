import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import {
  MatButtonModule, MatCardModule, MatExpansionModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatProgressSpinnerModule,
  MatToolbarModule, MatTooltipModule,
} from '@angular/material'

import { GraphComponent } from './components/graph.component'
import { InputErrorComponent } from './components/input-error.component'
import { LoadingSpinnerComponent } from './components/loading-spinner.component'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,

    GraphComponent,
    InputErrorComponent,
    LoadingSpinnerComponent,
  ],
  declarations: [
    GraphComponent,
    InputErrorComponent,
    LoadingSpinnerComponent,
  ],
})
export class SharedModule {}
