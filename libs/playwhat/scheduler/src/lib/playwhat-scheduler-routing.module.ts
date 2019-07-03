import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SchedulerNewComponent } from './scheduler-new/scheduler-new.component';
import { ScheduleFormViewComponent } from './schedule-form';
import { SchedulerDashboardComponent } from './scheduler-dashboard/scheduler-dashboard.component';
import { ScheduleFormListComponent } from './schedule-form/schedule-form-list/schedule-form-list.component';

// This routing config is for Angular Lazy Loading Module (A.K.A Route.loadChildren, just google it), if needed someday.
const loadChildrenRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'new' },
  { path: 'new', component: SchedulerNewComponent },
  {
    path: 'forms',
    children: [{ path: ':id', component: ScheduleFormViewComponent }]
  },
  { path: 'my', children: [
    { path: '', pathMatch: 'full', component: SchedulerDashboardComponent },
    { path: 'forms', component: ScheduleFormListComponent }
  ]}
];

const routes = [
  {path: 'scheduler', children: loadChildrenRoutes}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
    // If this module is meant to be lazy loaded, use loadChildrenRoutes instead
    // RouterModule.forChild(loadChildrenRoutes)
  ]
})
export class PlaywhatSchedulerRoutingModule { }
