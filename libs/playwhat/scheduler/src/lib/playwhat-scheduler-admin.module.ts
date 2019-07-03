import { NgModule, APP_INITIALIZER, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';
import { SchedulerAdminService } from './admin/scheduler-admin.service';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { Image } from '@ygg/shared/types';
import { AdminAgentComponent } from './admin/admin-agent/admin-agent.component';
import { SharedUserModule } from '@ygg/shared/user';

@NgModule({
  declarations: [AdminAgentComponent],
  imports: [
    CommonModule,
    SharedUserModule
  ],
  entryComponents: [
    AdminAgentComponent
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: configMenuTree, deps:[SchedulerAdminService, PlaywhatAdminService], multi: true },
  ]
})
export class PlaywhatSchedulerAdminModule { }

function configMenuTree(schedulerAdminService: SchedulerAdminService, playwhatAdminService: PlaywhatAdminService): Function {
  return () => {
    // console.log('Init module SchedulerAdminRoutingModule');
    schedulerAdminService.menu.addItem({
      id: 'staff',
      label: '角色人員',
      icon: new Image('/assets/images/admin/users.png'),
      link: 'staff',
      tooltip: '管理各帳號擔任的角色及工作人員'
    }, 'scheduler');
    schedulerAdminService.menu.addItem({
      id: 'agent',
      label: '接單服務人員',
      icon: new Image('/assets/images/admin/staff.svg'),
      link: 'agent',
      tooltip: '對外接單服務的聯絡窗口',
      component: AdminAgentComponent
    }, 'staff');
    
    playwhatAdminService.menu.addMenu(schedulerAdminService.menu);
  };
}