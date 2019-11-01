import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SchedulerNewComponent } from './scheduler-new/scheduler-new.component';
import { SchedulePlanViewComponent, SchedulePlanComponent } from './schedule-plan';
import { SchedulerDashboardComponent } from './scheduler-dashboard/scheduler-dashboard.component';
import { SchedulePlanListComponent } from './schedule-plan/schedule-plan-list/schedule-plan-list.component';
import { SchedulePlanResolverService } from './schedule-plan/schedule-plan-resolver.service';
import { SchedulePlanEditPageComponent } from './schedule-plan/pages/schedule-plan-edit-page/schedule-plan-edit-page.component';
import { SchedulePlanViewPageComponent } from './schedule-plan/pages/schedule-plan-view-page/schedule-plan-view-page.component';

// This routing config is for Angular Lazy Loading Module (A.K.A Route.loadChildren, just google it), if needed someday.
const loadChildrenRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'new' },
  { path: 'new', component: SchedulePlanEditPageComponent },
  {
    path: 'forms',
    children: [
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
    path: 'my',
    children: [
      { path: '', pathMatch: 'full', component: SchedulerDashboardComponent },
      {
        path: 'forms',
        children: [
          { path: '', pathMatch: 'full', component: SchedulePlanListComponent },
          {
            path: ':id',
            component: SchedulePlanViewPageComponent,
            resolve: {
              schedulePlan: SchedulePlanResolverService
            }
          }
        ]
      }
    ]
  }
];

const routes = [{ path: 'scheduler', children: loadChildrenRoutes }];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
    // If this module is meant to be lazy loaded, use loadChildrenRoutes instead
    // RouterModule.forChild(loadChildrenRoutes)
  ]
})
export class PlaywhatSchedulerRoutingModule {}
