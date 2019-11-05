import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAgentComponent } from './admin-agent/admin-agent.component';
import { AdminSchedulePlansComponent } from './admin-schedule-plans/admin-schedule-plans.component';
import { SharedUserModule } from '@ygg/shared/user';
import { ScheduleUiModule } from '@ygg/schedule/ui';

@NgModule({
  declarations: [AdminAgentComponent, AdminSchedulePlansComponent],
  imports: [CommonModule, SharedUserModule, ScheduleUiModule]
})
export class ScheduleAdminModule {}
