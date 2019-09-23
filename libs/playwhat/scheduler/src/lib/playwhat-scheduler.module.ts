import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedTypesModule } from '@ygg/shared/types';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { PlaywhatPlayModule } from '@ygg/playwhat/play';
import { PlaywhatTagModule } from '@ygg/playwhat/tag';

import { ScheduleFormComponent } from './schedule-form';
import { ScheduleFormViewComponent } from './schedule-form/schedule-form-view/schedule-form-view.component';
import { SharedUserModule } from '@ygg/shared/user';
import { SchedulerNewComponent } from './scheduler-new/scheduler-new.component';
import { SchedulerDashboardComponent } from './scheduler-dashboard/scheduler-dashboard.component';
import { ScheduleFormListComponent } from './schedule-form/schedule-form-list/schedule-form-list.component';
import { RouterModule } from '@angular/router';
import { ScheduleFormThumbnailComponent } from './schedule-form/schedule-form-thumbnail/schedule-form-thumbnail.component';
import { ScheduleFormTableComponent } from './schedule-form/schedule-form-table/schedule-form-table.component';


@NgModule({
  declarations: [SchedulerNewComponent, ScheduleFormComponent, ScheduleFormViewComponent, SchedulerDashboardComponent, ScheduleFormListComponent, ScheduleFormThumbnailComponent, ScheduleFormTableComponent],
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
    PlaywhatTagModule
  ],
  exports: [SchedulerNewComponent, ScheduleFormComponent, ScheduleFormViewComponent, SchedulerDashboardComponent, ScheduleFormListComponent, ScheduleFormThumbnailComponent, ScheduleFormTableComponent],
})
export class PlaywhatSchedulerModule {}

