import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUserUiModule } from "@ygg/shared/user/ui";
import { ShoppingUiModule } from '@ygg/shopping/ui';
import { TagsUiModule } from '@ygg/tags/ui';
import {
  SchedulePlanControlComponent,
  SchedulePlanListComponent,
  SchedulePlanTableComponent,
  SchedulePlanThumbnailComponent,
  SchedulePlanViewComponent
} from './schedule-plan';
import { ScheduleComponent } from './schedule/schedule/schedule.component';

@NgModule({
  declarations: [ScheduleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUserUiModule,
    SharedOmniTypesUiModule,
  ],
  exports: []
})
export class ScheduleUiModule {}
