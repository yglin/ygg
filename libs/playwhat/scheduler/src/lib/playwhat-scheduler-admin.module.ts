import { NgModule, APP_INITIALIZER, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';
import { SchedulerAdminService } from './admin/scheduler-admin.service';
// import { MenuTree } from '@ygg/shared/ui/navigation';
// import { Image } from '@ygg/shared/types';
import { AdminAgentComponent } from './admin/admin-agent/admin-agent.component';
import { SharedUserModule } from '@ygg/shared/user';
import { adminMenu } from "./admin";
import { AdminScheduleFormsComponent } from './admin/admin-schedule-forms/admin-schedule-forms.component';
import { PlaywhatSchedulerModule } from './playwhat-scheduler.module';

@NgModule({
  declarations: [AdminAgentComponent, AdminScheduleFormsComponent],
  imports: [
    CommonModule,
    SharedUserModule,
    PlaywhatSchedulerModule
  ],
  entryComponents: [
    AdminAgentComponent,
    AdminScheduleFormsComponent
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: configMenuTree, deps:[SchedulerAdminService, PlaywhatAdminService], multi: true },
  ]
})
export class PlaywhatSchedulerAdminModule { }

export function configMenuTree(schedulerAdminService: SchedulerAdminService, playwhatAdminService: PlaywhatAdminService): Function {
  return () => {
    schedulerAdminService.menu = adminMenu;
    playwhatAdminService.menu.addMenu(schedulerAdminService.menu);
  };
}