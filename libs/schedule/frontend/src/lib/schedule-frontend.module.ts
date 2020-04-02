import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuService } from "@ygg/shared/user/ui";
import { ScheduleUiModule } from '@ygg/schedule/ui';
import { SchedulePlanListPageComponent } from './schedule-plan-list-page/schedule-plan-list-page.component';
import { SchedulePlanEditPageComponent } from './schedule-plan-edit-page/schedule-plan-edit-page.component';
import { SchedulePlanViewPageComponent } from './schedule-plan-view-page/schedule-plan-view-page.component';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { MyScheduleDashboardComponent } from "./my-schedule-dashboard/my-schedule-dashboard.component";
import { ScheduleEditPageComponent } from './schedule-edit-page/schedule-edit-page.component';

@NgModule({
  declarations: [
    SchedulePlanListPageComponent,
    SchedulePlanEditPageComponent,
    SchedulePlanViewPageComponent,
    MyScheduleDashboardComponent,
    ScheduleEditPageComponent
  ],
  imports: [
    CommonModule,
    SharedUiWidgetsModule,
    ScheduleUiModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configUserMenu,
      deps: [UserMenuService],
      multi: true
    }
  ]
})
export class ScheduleFrontendModule {}

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
