import {Routes} from '@angular/router';
import {SchedulerComponent} from './scheduler/scheduler.component';
import { ScheduleFormComponent } from '@ygg/shared/domain/schedule';

export const routes: Routes = [
  {
    path: 'scheduler',
    children: [{path: '', pathMatch: 'full', component: ScheduleFormComponent}]
  }
];