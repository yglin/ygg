import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedUiNavigationModule } from '@ygg/shared/ui/navigation';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { routes } from './routes';
import { AdminStaffComponent } from './components/admin-staff/admin-staff.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedUiNavigationModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminDashboardComponent, AdminStaffComponent],
  exports: [AdminDashboardComponent, AdminStaffComponent]
})
export class PlaywhatAdminModule {}
