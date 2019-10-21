import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SchedulerNewComponent } from './scheduler-new/scheduler-new.component';
import { ScheduleFormViewComponent, ScheduleFormComponent } from './schedule-form';
import { SchedulerDashboardComponent } from './scheduler-dashboard/scheduler-dashboard.component';
import { ScheduleFormListComponent } from './schedule-form/schedule-form-list/schedule-form-list.component';
import { ScheduleFormResolverService } from './schedule-form/schedule-form-resolver.service';
import { ScheduleFormEditPageComponent } from './schedule-form/pages/schedule-form-edit-page/schedule-form-edit-page.component';
import { ScheduleFormViewPageComponent } from './schedule-form/pages/schedule-form-view-page/schedule-form-view-page.component';

// This routing config is for Angular Lazy Loading Module (A.K.A Route.loadChildren, just google it), if needed someday.
const loadChildrenRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'new' },
  { path: 'new', component: ScheduleFormEditPageComponent },
  {
    path: 'forms',
    children: [
      {
        path: ':id',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: ScheduleFormViewPageComponent,
            resolve: {
              scheduleForm: ScheduleFormResolverService
            }
          },
          {
            path: 'edit',
            component: ScheduleFormEditPageComponent,
            resolve: {
              scheduleForm: ScheduleFormResolverService
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
          { path: '', pathMatch: 'full', component: ScheduleFormListComponent },
          {
            path: ':id',
            component: ScheduleFormViewPageComponent,
            resolve: {
              scheduleForm: ScheduleFormResolverService
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
