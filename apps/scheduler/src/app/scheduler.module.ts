import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';

import { SchedulerComponent } from './scheduler/scheduler.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { ScheduleViewComponent } from './schedule-view/schedule-view.component';
import { SchedulerAutoComponent } from './scheduler-auto/scheduler-auto.component';
import { SchedulerManualComponent } from './scheduler-manual/scheduler-manual.component';
import { ResourceSelectorComponent } from './resource-selector/resource-selector.component';

@NgModule({
  declarations: [SchedulerComponent, ScheduleFormComponent, ScheduleViewComponent, SchedulerAutoComponent, SchedulerManualComponent, ResourceSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule
  ]
})
export class SchedulerModule { }
