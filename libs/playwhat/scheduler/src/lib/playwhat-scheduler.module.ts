import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { PlaywhatPlayModule } from '@ygg/playwhat/play';
import { TagsUiModule } from '@ygg/tags/ui';

import { SharedUserModule } from '@ygg/shared/user';
import { RouterModule } from '@angular/router';
import { ScheduleUiModule } from '@ygg/schedule/ui';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PlaywhatPlayModule,
    ScheduleUiModule
  ]
})
export class PlaywhatSchedulerModule {}
