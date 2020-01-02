import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellListComponent } from './cell/cell-list/cell-list.component';
import { CellFormComponent } from './cell/cell-form/cell-form.component';
import { CellControlComponent } from './cell/cell-control/cell-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { CellViewComponent } from './cell/cell-view/cell-view.component';
import { TheThingCreatorComponent, TheThingViewComponent } from './the-thing';
import { TagsUiModule } from "@ygg/tags/ui";
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedTypesModule } from '@ygg/shared/types';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedTypesModule,
    TagsUiModule
  ],
  declarations: [
    CellListComponent,
    CellFormComponent,
    CellControlComponent,
    CellViewComponent,
    TheThingCreatorComponent,
    TheThingViewComponent
  ],
  exports: [
    CellListComponent,
    CellFormComponent,
    CellControlComponent,
    CellViewComponent,
    TheThingCreatorComponent,
    TheThingViewComponent
  ]
})
export class TheThingUiModule {}
