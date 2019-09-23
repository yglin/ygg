import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsControlComponent, TagsViewComponent } from './tags';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';

@NgModule({
  declarations: [TagsControlComponent, TagsViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule
  ],
  exports: [
    TagsControlComponent, TagsViewComponent
  ]
})
export class PlaywhatTagModule {}
