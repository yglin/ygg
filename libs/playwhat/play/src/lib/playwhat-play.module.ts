import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PlayTagsInputComponent } from './tag/play-tags-input/play-tags-input.component';
import { SharedTypesModule } from '@ygg/shared/types';
import { PlayFormComponent } from './play/play-form/play-form.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { PlayViewComponent } from './play/play-view/play-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagsUiModule } from '@ygg/tags/ui';
// import { PlayNewComponent } from './pages/play-new/play-new.component';
import { PlayEditPageComponent } from './pages/play-edit-page/play-edit-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedTypesModule,
    SharedUiWidgetsModule,
    SharedUiNgMaterialModule,
    TagsUiModule
  ],
  declarations: [PlayFormComponent, PlayViewComponent, PlayEditPageComponent],
  exports: [PlayFormComponent, PlayViewComponent]
})
export class PlaywhatPlayModule {}
