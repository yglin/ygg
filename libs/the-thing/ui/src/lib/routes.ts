import { Route } from '@angular/router';
import { TheThingComponent } from './the-thing/the-thing/the-thing.component';
import { MyThingsDataTableComponent } from './the-thing/my-things-data-table/my-things-data-table.component';
import { ImitationResolver } from './imitation-resolver.service';
import { TheThingResolver } from './the-thing-resolver.service';

export const routes: Route[] = [
  {
    path: 'the-things',
    children: [
      {
        path: ':imitationId',
        children: [
          {
            path: 'my',
            component: MyThingsDataTableComponent,
            resolve: {
              imitation: ImitationResolver
            }
          },
          {
            path: ':id',
            component: TheThingComponent,
            resolve: {
              imitation: ImitationResolver,
              theThing$: TheThingResolver
            }
          }
        ]
      }
    ]
  }
];
