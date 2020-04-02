import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PlayTagsInputComponent } from './tag/play-tags-input/play-tags-input.component';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { PlayFormComponent } from './play/play-form/play-form.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { PlayViewComponent } from './play/play-view/play-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagsUiModule } from '@ygg/tags/ui';
// import { PlayNewComponent } from './pages/play-new/play-new.component';
import { PlayEditPageComponent } from './play/pages/play-edit-page/play-edit-page.component';
import { PlayListComponent } from './play/play-list/play-list.component';
import { PlayThumbnailComponent } from './play/play-thumbnail/play-thumbnail.component';
import { PlayDashboardComponent } from './play/play-dashboard/play-dashboard.component';
import { RouterModule } from '@angular/router';
import { SharedUserUiModule } from "@ygg/shared/user/ui";
import { PlayViewPageComponent } from './play/pages/play-view-page/play-view-page.component';
import { PlaySelectorComponent } from './play/play-selector/play-selector.component';
import { AdditionEditDialogComponent } from './play/addition-edit-dialog/addition-edit-dialog.component';
import { ResourceUiModule } from '@ygg/resource/ui';
import { SharedUiDynamicFormModule } from '@ygg/shared/ui/dynamic-form';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedUserUiModule,
    SharedTypesModule,
    SharedUiWidgetsModule,
    SharedUiNgMaterialModule,
    TagsUiModule,
    ResourceUiModule,
    SharedUiDynamicFormModule,
    SharedOmniTypesUiModule
  ],
  declarations: [
    PlayFormComponent,
    PlayViewComponent,
    PlayEditPageComponent,
    PlayListComponent,
    PlayThumbnailComponent,
    PlayDashboardComponent,
    PlayViewPageComponent,
    PlaySelectorComponent,
    AdditionEditDialogComponent
  ],
  entryComponents: [AdditionEditDialogComponent],
  exports: [PlayFormComponent, PlayViewComponent, PlaySelectorComponent]
})
export class PlaywhatPlayModule {}
