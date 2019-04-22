import {Routes} from '@angular/router';
import {SchedulerComponent} from './scheduler/scheduler.component';

export const routes: Routes = [
  {
    path: 'scheduler',
    children: [{path: '', pathMatch: 'full', component: SchedulerComponent}]
  }
];