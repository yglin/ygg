import { NgModule, APP_INITIALIZER, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';
import { SchedulerAdminService } from './admin/scheduler-admin.service';
// import { MenuTree } from '@ygg/shared/ui/navigation';
// import { Image } from '@ygg/shared/types';
import { AdminAgentComponent } from './admin/admin-agent/admin-agent.component';
import { SharedUserModule } from '@ygg/shared/user';
import { adminMenu } from "./admin";
import { AdminSchedulePlansComponent } from './admin/admin-schedule-plans/admin-schedule-plans.component';
import { PlaywhatSchedulerModule } from './playwhat-scheduler.module';

@NgModule({
  declarations: [AdminAgentComponent, AdminSchedulePlansComponent],
  imports: [
    CommonModule,
    SharedUserModule,
    PlaywhatSchedulerModule
  ],
  entryComponents: [
    AdminAgentComponent,
    AdminSchedulePlansComponent
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