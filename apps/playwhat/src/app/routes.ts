import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SchedulerNewComponent } from './pages/scheduler/new/scheduler-new.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'scheduler', children: [
    { path: '', pathMatch: 'full', redirectTo: 'new' },
    { path: 'new', component: SchedulerNewComponent }
  ] },
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];
