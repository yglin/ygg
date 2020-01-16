import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { CellListComponent } from './cell/cell-list/cell-list.component';
import { CellFormComponent } from './cell/cell-form/cell-form.component';
import { CellControlComponent } from './cell/cell-control/cell-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { CellViewComponent } from './cell/cell-view/cell-view.component';
import {
  TheThingEditorComponent,
  TheThingViewComponent,
  TheThingFinderComponent,
  TheThingListComponent
} from './the-thing';
import { TagsUiModule } from '@ygg/tags/ui';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedTypesModule } from '@ygg/shared/types';
import { TheThingThumbnailComponent } from './the-thing/the-thing-thumbnail/the-thing-thumbnail.component';
import { MyThingsComponent } from './the-thing/my-things/my-things.component';
import { SharedUserModule } from "@ygg/shared/user";
import { TheThingFilterComponent } from './the-thing/the-thing-filter/the-thing-filter.component';
import { TheThingFinderDialogComponent } from './the-thing/the-thing-finder-dialog/the-thing-finder-dialog.component';
import { routes } from "./routes";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedTypesModule,
    SharedUserModule,
    TagsUiModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CellListComponent,
    CellFormComponent,
    CellControlComponent,
    CellViewComponent,
    TheThingEditorComponent,
    TheThingViewComponent,
    TheThingFinderComponent,
    TheThingListComponent,
    TheThingThumbnailComponent,
    MyThingsComponent,
    TheThingFilterComponent,
    TheThingFinderDialogComponent
  ],
  exports: [
    CellListComponent,
    CellFormComponent,
    CellControlComponent,
    CellViewComponent,
    TheThingEditorComponent,
    TheThingViewComponent,
    TheThingFinderComponent,
    MyThingsComponent
  ],
  entryComponents: [TheThingFinderDialogComponent]
})
export class TheThingUiModule {}
