import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreadComponent } from './thread/thread.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUserUiModule } from '@ygg/shared/user/ui';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  declarations: [ThreadComponent, CommentListComponent, CommentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedUserUiModule,
    SharedOmniTypesUiModule,
    SharedUiWidgetsModule
  ],
  exports: [ThreadComponent]
})
export class SharedThreadUiModule {}
