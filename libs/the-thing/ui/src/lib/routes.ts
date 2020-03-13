import { Route } from '@angular/router';
import {
  TheThingFinderComponent,
  TheThingEditorComponent,
  MyThingsComponent,
  TheThingViewComponent,
  TheThingResolver,
  TheThingEditorPageObject
} from './the-thing';
import { LoggedInGuard, AdminGuard } from '@ygg/shared/user';
import { ImitationTemplateResolver } from './imitation-template-resolver.service';
import { ImitationManagerComponent } from './imitation';
import { MyThingsDataTableComponent } from './the-thing/my-things-data-table/my-things-data-table.component';
import { AdminThingsDataTableComponent } from './the-thing/admin-things-data-table/admin-things-data-table.component';
import { ImitationResolver } from './imitation/imitation-resolver.service';
import { TheThingEditPageComponent } from './the-thing/the-thing-edit-page/the-thing-edit-page.component';

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
        children: [
          { path: '', pathMatch: 'full', component: TheThingEditorComponent }
        ]
      },
      {
        path: 'my',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: MyThingsComponent
          },
          {
            path: ':imitation',
            component: MyThingsDataTableComponent,
            resolve: {
              imitation: ImitationResolver
            }
          }
        ],
        canActivateChild: [LoggedInGuard]
      },
      {
        path: 'admin',
        children: [{
          path: ':imitation',
          component: AdminThingsDataTableComponent,
          resolve: {
            imitation: ImitationResolver
          }
        }],
        canActivateChild: [AdminGuard]
      },
      {
        path: 'imitations',
        component: ImitationManagerComponent
        // canActivate: [LoggedInGuard, AdminGuard]
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
            component: TheThingEditPageComponent,
            resolve: {
              theThing: TheThingResolver
            }
          },
          {
            path: 'clone',
            component: TheThingEditorComponent,
            resolve: {
              clone: TheThingResolver
            }
          }
        ]
      }
    ]
  }
];
