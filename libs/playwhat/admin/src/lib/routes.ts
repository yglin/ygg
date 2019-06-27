import { Routes } from '@angular/router';
import { LoggedInGuard, AdminGuard } from '@ygg/shared/user';
import { AdminStaffComponent } from './components/admin-staff/admin-staff.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  {
    path: 'admin',
    canActivateChild: [LoggedInGuard, AdminGuard],
    children: [
      { path: '', pathMatch: 'full', component: AdminDashboardComponent },
      { path: 'staff', component: AdminStaffComponent }
    ]
  }
];
