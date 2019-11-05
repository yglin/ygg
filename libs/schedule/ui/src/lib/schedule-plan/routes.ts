import { SchedulePlanListComponent } from './components';
import { SchedulePlanEditPageComponent, SchedulePlanViewPageComponent } from "./pages";
import { SchedulePlanResolverService, MySchedulePlansResolverService } from './schedule-plan-resolver.service';
import { LoggedInGuard } from "@ygg/shared/user";
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'schedule-plans',
    children: [
      {
        path: 'my',
        pathMatch: 'full',
        component: SchedulePlanListComponent,
        resolve: {
          schedulePlans: MySchedulePlansResolverService
        },
        canActivate: [ LoggedInGuard ]
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
  }
];
