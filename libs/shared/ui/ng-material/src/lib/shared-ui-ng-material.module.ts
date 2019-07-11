import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatRadioModule,
  MatCheckboxModule,
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
  MatSliderModule,
  MatDividerModule,
  MatTabsModule,
  MatExpansionModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatGridListModule
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  exports: [
    MatToolbarModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
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
    MatSliderModule,
    MatDividerModule,
    MatTabsModule,
    MatExpansionModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatGridListModule,
    DragDropModule
  ]
})
export class SharedUiNgMaterialModule {}
