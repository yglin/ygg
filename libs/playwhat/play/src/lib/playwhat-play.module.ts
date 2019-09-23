import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PlayTagsInputComponent } from './tag/play-tags-input/play-tags-input.component';
import { SharedTypesModule } from '@ygg/shared/types';
import { PlayFormComponent } from './play/play-form/play-form.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { PlayViewComponent } from './play/play-view/play-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlaywhatTagModule } from '@ygg/playwhat/tag';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedTypesModule, SharedUiWidgetsModule, SharedUiNgMaterialModule, PlaywhatTagModule],
  declarations: [PlayFormComponent, PlayViewComponent],
  exports: [PlayFormComponent, PlayViewComponent]
})
export class PlaywhatPlayModule {}
