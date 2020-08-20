import { Routes } from '@angular/router';
// import { HomeComponent } from './pages/home/home.component';
import { MapSearchComponent } from './map/map-search/map-search.component';
// import { BoxCreateComponent } from './pages/box/box-create/box-create.component';
// import { BoardComponent } from './pages/board/board.component';
// import { BoxViewComponent } from './pages/box/box-view/box-view.component';
// import { ItemViewComponent } from './pages/item/item-view/item-view.component';
// import { BoxFactoryService } from './box-factory.service';
import {
  ImitationItem,
  ImitationItemTransferStates,
  ImitationItemTransfer
} from '@ygg/ourbox/core';
import { BoxCreateComponent } from './box/box-create/box-create.component';
// import { ItemFactoryService } from './item-factory.service';
// import { MyBoxesComponent } from './pages/box/my-boxes/my-boxes.component';
// import { ItemTransferComponent } from './pages/item/item-transfer/item-transfer.component';
// import { ItemTransferFactoryService } from './item-transfer-factory.service';

export const routes: Routes = [
  {
    path: 'ourbox',
    children: [
      // {
      //   path: 'home',
      //   component: HomeComponent
      // },
      {
        path: 'map',
        component: MapSearchComponent
      },
      {
        path: 'create-box',
        component: BoxCreateComponent
      }
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
    ]
  }
];
