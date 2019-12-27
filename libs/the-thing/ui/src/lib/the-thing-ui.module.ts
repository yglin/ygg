import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellListComponent } from './cell/cell-list/cell-list.component';
import { CellFormComponent } from './cell/cell-form/cell-form.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CellListComponent, CellFormComponent],
  exports: [CellListComponent, CellFormComponent]
})
export class TheThingUiModule {}
