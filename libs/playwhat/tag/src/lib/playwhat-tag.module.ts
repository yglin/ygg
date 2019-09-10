import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsControlComponent, TagsViewComponent } from './tags';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

@NgModule({
  declarations: [TagsControlComponent, TagsViewComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule]
})
export class PlaywhatTagModule {}
