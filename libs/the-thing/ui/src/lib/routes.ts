import { Route } from '@angular/router';
import { TheThingFinderComponent, TheThingEditorComponent, MyThingsComponent, TheThingViewComponent, TheThingResolver } from './the-thing';
import { LoggedInGuard } from '@ygg/shared/user';

export const routes: Route[] = [
  {
    path: 'the-things',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: TheThingFinderComponent
      },
      {
        path: 'create',
        component: TheThingEditorComponent
      },
      {
        path: 'my',
        component: MyThingsComponent,
        canActivate: [LoggedInGuard]
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: TheThingViewComponent,
            resolve: {
              theThing: TheThingResolver
            }
          },
          {
            path: 'edit',
            component: TheThingEditorComponent,
            resolve: {
              theThing: TheThingResolver
            }
          }
        ]
      }
    ]
  }
];
