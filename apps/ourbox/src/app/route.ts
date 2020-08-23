import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'ourbox'
  },
  // {
  //   path: 'home',
  //   component: HomeComponent
  // },
  // {
  //   path: 'map',
  //   component: MapComponent
  // },
  // {
  //   path: 'ourbox',
  //   children: [
  //     {
  //       path: 'create',
  //       component: BoxCreateComponent
  //     },
  //     {
  //       path: 'my',
  //       component: MyBoxesComponent
  //     },
  //     {
  //       path: ':id',
  //       component: BoxViewComponent,
  //       resolve: {
  //         box: BoxFactoryService
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: 'board',
  //   component: BoardComponent
  // },
  // {
  //   path: ImitationItem.routePath,
  //   children: [
  //     {
  //       path: ':id',
  //       component: ItemViewComponent,
  //       resolve: {
  //         item$: ItemFactoryService
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: ImitationItemTransfer.routePath,
  //   children: [
  //     {
  //       path: ':id',
  //       component: ItemTransferComponent,
  //       resolve: {
  //         itemTransfer$: ItemTransferFactoryService
  //       }
  //     }
  //   ]
  // }
];
