import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuService } from '@ygg/shared/user';
import { PlaywhatSchedulerModule } from './playwhat-scheduler.module';
import { PlaywhatSchedulerRoutingModule } from './playwhat-scheduler-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlaywhatSchedulerModule,
    PlaywhatSchedulerRoutingModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: configUserMenu, deps: [UserMenuService], multi: true }
  ]

})
export class PlaywhatSchedulerFrontendModule { }

export function configUserMenu(userMenuService: UserMenuService) {
  return () => {
    userMenuService.addItem({
      id: 'scheduler',
      label: '我的遊程',
      link: 'scheduler/my',
      icon: 'directions_bike'
    });
  };
}
