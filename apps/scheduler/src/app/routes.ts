import {Routes} from '@angular/router';

import {SchedulerFormViewPageComponent} from './scheduler-form-view-page/scheduler-form-view-page.component';
// import {SchedulerComponent} from './scheduler/scheduler.component';
// import { ScheduleFormComponent } from '@ygg/shared/domain/schedule';
import {SchedulerFormPageComponent} from './scheduler-form-page/scheduler-form-page.component';

export const routes: Routes = [{
  path: 'scheduler',
  children: [
    {
      path: 'forms',
      children: [
        {path: 'new', pathMatch: 'full', component: SchedulerFormPageComponent},
        {path: ':id', component: SchedulerFormViewPageComponent}
      ]
    },
    {path: '', pathMatch: 'full', redirectTo: 'forms/new'}
  ]
}];