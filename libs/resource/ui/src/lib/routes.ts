import { Routes } from '@angular/router';
import { AccommodationEditComponent } from './pages/accommodation-edit/accommodation-edit.component';
import { AccommodationDetailComponent } from './pages/accommodation-detail/accommodation-detail.component';
import { AccommodationResolver } from './accommodation/accommodation-resolver.service';

export const routes: Routes = [{ path: 'accommodations', children: [
  { path: 'new', component: AccommodationEditComponent },
  { path: ':id', component: AccommodationDetailComponent, resolve: {
    accommodation: AccommodationResolver
  }}
] }];
