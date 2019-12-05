import { Routes } from '@angular/router';
import { AccommodationEditComponent } from './pages/accommodation-edit/accommodation-edit.component';

export const routes: Routes = [{ path: 'accommodations', children: [
  { path: 'new', component: AccommodationEditComponent }
] }];
