import { Route } from '@angular/router';
import { MyPlayListComponent } from './ui/my-play-list/my-play-list.component';

export const routes: Route[] = [
  { path: 'plays', children: [{ path: 'my', component: MyPlayListComponent }] }
];
