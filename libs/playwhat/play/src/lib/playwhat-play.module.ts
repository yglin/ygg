import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayTagsInputComponent } from './tag/play-tags-input/play-tags-input.component';
import { SharedTypesModule } from '@ygg/shared/types';
import { PlayFormComponent } from './play/play-form/play-form.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

@NgModule({
  imports: [CommonModule, SharedTypesModule, SharedUiNgMaterialModule],
  declarations: [PlayTagsInputComponent, PlayFormComponent],
  exports: [PlayTagsInputComponent, PlayFormComponent]
})
export class PlaywhatPlayModule {}
