import { CommonModule } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedTypesModule } from '@ygg/shared/types';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { PlaywhatResourceModule } from '@ygg/playwhat/resource';

import { ScheduleFormComponent } from './schedule-form';
import { ScheduleFormViewComponent } from './schedule-form/schedule-form-view/schedule-form-view.component';
import { SharedUserModule, UserMenuService } from '@ygg/shared/user';
import { SchedulerNewComponent } from './scheduler-new/scheduler-new.component';
import { PlaywhatSchedulerRoutingModule } from './playwhat-scheduler-routing.module';
import { SchedulerDashboardComponent } from './scheduler-dashboard/scheduler-dashboard.component';
import { ScheduleFormListComponent } from './schedule-form/schedule-form-list/schedule-form-list.component';
import { RouterModule } from '@angular/router';
import { ScheduleFormThumbnailComponent } from './schedule-form/schedule-form-thumbnail/schedule-form-thumbnail.component';

@NgModule({
  declarations: [SchedulerNewComponent, ScheduleFormComponent, ScheduleFormViewComponent, SchedulerDashboardComponent, ScheduleFormListComponent, ScheduleFormThumbnailComponent],
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
    PlaywhatResourceModule,
    PlaywhatSchedulerRoutingModule
  ],
  // exports: [ScheduleFormComponent, ScheduleFormViewComponent],
  providers: [
    { provide: APP_INITIALIZER, useFactory: configUserMenu, deps: [UserMenuService], multi: true }
  ]
})
export class PlaywhatSchedulerModule {}

function configUserMenu(userMenuService: UserMenuService) {
  return () => {
    userMenuService.addItem({
      id: 'scheduler',
      label: '我的遊程',
      link: 'scheduler/my',
      icon: 'directions_bike'
    });
  };
}
