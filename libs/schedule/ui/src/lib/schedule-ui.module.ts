import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUserUiModule } from '@ygg/shared/user/ui';
import { routes } from './routes';
import { ScheduleComponent } from './schedule/schedule/schedule.component';
import { SchedulerTimeTableComponent } from './scheduler/scheduler-time-table/scheduler-time-table.component';
import { ServiceEventSpanComponent } from './scheduler/service-event-span/service-event-span.component';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  declarations: [ScheduleComponent, SchedulerTimeTableComponent, ServiceEventSpanComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUserUiModule,
    SharedOmniTypesUiModule,
    DragulaModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  exports: []
})
export class ScheduleUiModule {}
