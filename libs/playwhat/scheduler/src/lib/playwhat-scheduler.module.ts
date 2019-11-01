import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedTypesModule } from '@ygg/shared/types';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { PlaywhatPlayModule } from '@ygg/playwhat/play';
import { TagsUiModule } from '@ygg/tags/ui';

import { SchedulePlanComponent } from './schedule-plan';
import { SchedulePlanViewComponent } from './schedule-plan/schedule-plan-view/schedule-plan-view.component';
import { SharedUserModule } from '@ygg/shared/user';
import { SchedulerNewComponent } from './scheduler-new/scheduler-new.component';
import { SchedulerDashboardComponent } from './scheduler-dashboard/scheduler-dashboard.component';
import { SchedulePlanListComponent } from './schedule-plan/schedule-plan-list/schedule-plan-list.component';
import { RouterModule } from '@angular/router';
import { SchedulePlanThumbnailComponent } from './schedule-plan/schedule-plan-thumbnail/schedule-plan-thumbnail.component';
import { SchedulePlanTableComponent } from './schedule-plan/schedule-plan-table/schedule-plan-table.component';
import { SchedulePlanEditPageComponent } from './schedule-plan/pages/schedule-plan-edit-page/schedule-plan-edit-page.component';
import { SchedulePlanViewPageComponent } from './schedule-plan/pages/schedule-plan-view-page/schedule-plan-view-page.component';

@NgModule({
  declarations: [
    SchedulerNewComponent,
    SchedulePlanComponent,
    SchedulePlanViewComponent,
    SchedulerDashboardComponent,
    SchedulePlanListComponent,
    SchedulePlanThumbnailComponent,
    SchedulePlanTableComponent,
    SchedulePlanEditPageComponent,
    SchedulePlanViewPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedTypesModule,
    SharedUserModule,
    PlaywhatPlayModule,
    TagsUiModule
  ],
  exports: [
    SchedulerNewComponent,
    SchedulePlanComponent,
    SchedulePlanViewComponent,
    SchedulerDashboardComponent,
    SchedulePlanListComponent,
    SchedulePlanThumbnailComponent,
    SchedulePlanTableComponent
  ]
})
export class PlaywhatSchedulerModule {}
