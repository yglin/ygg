import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatToolbarModule,
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
  MatProgressSpinnerModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSortModule,
  MatSelectModule,
  MatSliderModule
} from '@angular/material';

@NgModule({
  exports: [
    MatToolbarModule,
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
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatSliderModule
  ]
})
export class SharedUiNgMaterialModule {}
