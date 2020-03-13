import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
// import { SchedulerNewComponent } from './pages/scheduler/new/scheduler-new.component';
// import { SchedulerFormViewComponent } from './pages/scheduler/form/scheduler-form-view/scheduler-form-view.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, runGuardsAndResolvers: 'always' },
  // {
  //   path: 'scheduler',
  //   children: [
  //     { path: '', pathMatch: 'full', redirectTo: 'new' },
  //     { path: 'new', component: SchedulerNewComponent },
  //     {
  //       path: 'plans',
  //       children: [{ path: ':id', component: SchedulerFormViewComponent }]
  //     }
  //   ]
  // },
  // {
  //   path: 'admin',
  //   canActivateChild: [LoggedInGuard, AdminGuard],
  //   children: [
  //     { path: '', pathMatch: 'full', component: AdminDashboardComponent }
  //   ]
  // },
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];
