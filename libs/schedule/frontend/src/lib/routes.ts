import { LoggedInGuard } from '@ygg/shared/user';
import { Routes } from '@angular/router';
import { SchedulePlanListPageComponent } from './schedule-plan-list-page/schedule-plan-list-page.component';
import { SchedulePlanEditPageComponent } from './schedule-plan-edit-page/schedule-plan-edit-page.component';
import { SchedulePlanViewPageComponent } from './schedule-plan-view-page/schedule-plan-view-page.component';
import {
  SchedulePlanResolverService,
  MySchedulePlansResolverService
} from './schedule-plan-resolver.service';
import { MyScheduleDashboardComponent } from './my-schedule-dashboard/my-schedule-dashboard.component';
import { ScheduleEditPageComponent } from './schedule-edit-page/schedule-edit-page.component';

export const routes: Routes = [
  {
    path: 'scheduler',
    children: [
      {
        path: 'my',
        component: MyScheduleDashboardComponent,
        canActivate: [LoggedInGuard]
      },
      {
        path: 'schedule-plans',
        children: [
          {
            path: 'my',
            pathMatch: 'full',
            component: SchedulePlanListPageComponent,
            resolve: {
              schedulePlans: MySchedulePlansResolverService
            },
            canActivate: [LoggedInGuard]
          },
          {
            path: 'new',
            component: SchedulePlanEditPageComponent
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: SchedulePlanViewPageComponent,
                resolve: {
                  schedulePlan: SchedulePlanResolverService
                }
              },
              {
                path: 'edit',
                component: SchedulePlanEditPageComponent,
                resolve: {
                  schedulePlan: SchedulePlanResolverService
                }
              }
            ]
          }
        ]
      },
      {
        path: 'schedules',
        children: [
          {
            path: ':id',
            children: [{ path: 'edit', component: ScheduleEditPageComponent }]
          }
        ]
      }
    ]
  }
];
