import {Route} from '@angular/router';
import {DialogsComponent} from './dialogs/dialogs.component';

export const routes: Route[] = [
  {path: 'dialogs', component: DialogsComponent},
  {path: '', pathMatch: 'full', redirectTo: 'dialogs'}
];