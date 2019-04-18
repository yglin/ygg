import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UserProfileComponent} from './ui/user-profile/user-profile.component';

const routes: Routes = [
  {path: 'users', children: [{path: 'me', component: UserProfileComponent}]}
];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class UserRoutingModule {
}
