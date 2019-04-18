import { Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const routes: Routes = [
  {path: 'users', children: [{path: 'me', component: UserProfileComponent}]}
];