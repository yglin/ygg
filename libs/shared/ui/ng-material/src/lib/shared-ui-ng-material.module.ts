import { NgModule } from '@angular/core';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from "@angular/material/sidenav";

@NgModule({
  exports: [
    MatToolbarModule,
    // BrowserAnimationsModule,
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
    MatSlideToggleModule,
    MatDividerModule,
    MatTabsModule,
    MatExpansionModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatSnackBarModule,
    DragDropModule,
    MatButtonToggleModule,
    MatSidenavModule
  ]
})
export class SharedUiNgMaterialModule {}
