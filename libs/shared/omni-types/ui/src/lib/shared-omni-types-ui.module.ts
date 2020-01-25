import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HtmlControlComponent } from './types/html/html-control/html-control.component';
import { HtmlViewComponent } from './types/html/html-view/html-view.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
  DateRangeControlComponent,
  DateRangeViewComponent
} from './types/datetime';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CKEditorModule,
    SharedUiNgMaterialModule
  ],
  declarations: [
    HtmlControlComponent,
    HtmlViewComponent,
    DateRangeControlComponent,
    DateRangeViewComponent
  ],
  exports: [
    HtmlControlComponent,
    HtmlViewComponent,
    DateRangeControlComponent,
    DateRangeViewComponent
  ]
})
export class SharedOmniTypesUiModule {}
