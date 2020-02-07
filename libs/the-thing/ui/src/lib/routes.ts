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
import { ImitationTemplateResolver } from "./imitation-template-resolver.service";
import { ImitationManagerComponent } from './imitation';

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
          { path: '', pathMatch: 'full', component: TheThingEditorComponent },
          {
            path: ':imitation',
            component: TheThingEditorComponent,
            resolve: { imitationTemplate: ImitationTemplateResolver }
          }
        ]
      },
      {
        path: 'my',
        component: MyThingsComponent,
        canActivate: [LoggedInGuard]
      },
      {
        path: 'imitations',
        component: ImitationManagerComponent,
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
            component: TheThingEditorComponent,
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
