import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatRadioModule,
  MatIconModule,
  MatTooltipModule,
  MatBadgeModule,
  MatTableModule,
  MatStepperModule,
  MatCardModule,
  MatListModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  exports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatBadgeModule,
    MatTableModule,
    MatStepperModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class NgMaterialModule {}
