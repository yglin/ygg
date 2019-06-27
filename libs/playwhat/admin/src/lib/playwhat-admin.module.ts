import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { SharedUiWidgetsModule } from "@ygg/shared/ui/widgets";

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

@NgModule({
  imports: [CommonModule, RouterModule, SharedUiWidgetsModule],
  declarations: [AdminDashboardComponent],
  exports: [AdminDashboardComponent]
})
export class PlaywhatAdminModule {}
