import { Route } from '@angular/router';
import { PlayFormComponent } from './play/play-form/play-form.component';
import { PlayViewComponent } from './play/play-view/play-view.component';
import { PlayEditPageComponent } from './play/pages/play-edit-page/play-edit-page.component';
import { PlayListComponent } from './play/play-list/play-list.component';
import { MyPlaysResolver, PlayResolver } from './play/play-resolvers.service';
import { PlayDashboardComponent } from './play/play-dashboard/play-dashboard.component';
import { PlayViewPageComponent } from './play/pages/play-view-page/play-view-page.component';

export const routesForLazyLoad: Route[] = [
  { path: 'new', component: PlayEditPageComponent },
  {
    path: 'my',
    children: [
      { path: '', pathMatch: 'full', component: PlayDashboardComponent },
      {
        path: 'list',
        component: PlayListComponent,
        resolve: { plays: MyPlaysResolver }
      }
    ]
  },
  {
    path: ':id',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: PlayViewPageComponent,
        resolve: {
          play: PlayResolver
        }
      },
      {
        path: 'edit',
        component: PlayEditPageComponent,
        resolve: {
          play: PlayResolver
        }
      }
    ]
  }
];
