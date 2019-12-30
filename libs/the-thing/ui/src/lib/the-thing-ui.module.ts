import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellListComponent } from './cell/cell-list/cell-list.component';
import { CellFormComponent } from './cell/cell-form/cell-form.component';
import { CellControlComponent } from './cell/cell-control/cell-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule
  ],
  declarations: [CellListComponent, CellFormComponent, CellControlComponent],
  exports: [CellListComponent, CellFormComponent, CellControlComponent]
})
export class TheThingUiModule {}
