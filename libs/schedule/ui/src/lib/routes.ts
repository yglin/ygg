import { Routes } from '@angular/router';
import { ScheduleComponent } from './schedule/schedule/schedule.component';
import { ScheduleFactoryService } from './schedule-factory.service';

export const routes: Routes = [
  {
    path: 'schedule',
    children: [
      {
        path: ':id',
        component: ScheduleComponent,
        resolve: {
          schedule: ScheduleFactoryService
        }
      }
    ]
  }
];
