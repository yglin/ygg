import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreadComponent } from './thread/thread.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUserUiModule } from '@ygg/shared/user/ui';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [ThreadComponent],
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
