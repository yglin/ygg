import { concat } from 'lodash';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { routes as routesSchedulePlan } from './schedule-plan';
import { routes as routesDashboard } from './dashboard';
import { Scheduler } from 'rxjs';

const routes: Routes = [
  { path: 'scheduler', children: concat(routesDashboard, routesSchedulePlan) }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class ScheduleUiRoutingModule {}
