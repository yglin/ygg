import { Routes } from '@angular/router';
// import { HomeComponent } from './pages/home/home.component';
// import { MapSearchComponent } from './map/map-search/map-search.component';
// import { BoxCreateComponent } from './pages/box/box-create/box-create.component';
// import { BoardComponent } from './pages/board/board.component';
// import { BoxViewComponent } from './pages/box/box-view/box-view.component';
// import { ItemViewComponent } from './pages/item/item-view/item-view.component';
// import { BoxFactoryService } from './box-factory.service';
// import {
//   ImitationItem,
//   ImitationItemTransferStates,
//   ImitationItemTransfer,
//   ImitationBox
// } from '@ygg/ourbox/core';
// import { BoxCreateComponent } from './box/box-create/box-create.component';
// import { MyBoxesComponent } from './box/my-boxes/my-boxes.component';
// import { HomeComponent } from './home/home.component';
// import { BoxFactoryService } from './box/box-factory.service';
// import { BoxViewComponent } from './box/box-view/box-view.component';
// import { ItemWarehouseComponent } from './item/item-warehouse/item-warehouse.component';
// import { ItemFactoryService } from './item/item-factory.service';
// import { ItemComponent } from './item/item/item.component';
// import { MyHeldItemsComponent } from './item/my-held-items/my-held-items.component';
// import { ItemTransferComponent } from './item-transfer/item-transfer/item-transfer.component';
// import { ItemTransferFactoryService } from './item-transfer/item-transfer-factory.service';
// import { MyItemTransfersComponent } from './item-transfer/my-item-transfers/my-item-transfers.component';
// import { SiteHowtoComponent } from './misc/site-howto/site-howto.component';
// import { TreasureEditComponent } from './treasure/treasure-edit/treasure-edit.component';
import { TreasureCreateComponent } from './treasure/treasure-create/treasure-create.component';
import { TreasureCreateResolver } from './treasure/treasure-create/treasure-create.resolver';
// import { ItemFactoryService } from './item-factory.service';
// import { MyBoxesComponent } from './pages/box/my-boxes/my-boxes.component';
// import { ItemTransferComponent } from './pages/item/item-transfer/item-transfer.component';
// import { ItemTransferFactoryService } from './item-transfer-factory.service';

export const routes: Routes = [
  {
    path: 'treasure',
    children: [
      {
        path: 'create',
        component: TreasureCreateComponent,
        resolve: {
          treasure: TreasureCreateResolver
        }
      }
    ]
  },
  {
    path: 'ourbox',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: TreasureCreateComponent
        // redirectTo: 'map'
      },
      // {
      //   path: 'map',
      //   component: MapSearchComponent
      // },
      // {
      //   path: 'create-box',
      //   component: BoxCreateComponent
      // },
      // {
      //   path: 'my-boxes',
      //   component: MyBoxesComponent
      // },
      // {
      //   path: 'item-warehouse',
      //   component: ItemWarehouseComponent
      // },
      // {
      //   path: 'my-held-items',
      //   component: MyHeldItemsComponent
      // },
      // {
      //   path: 'my-item-transfers',
      //   component: MyItemTransfersComponent
      // },
      // {
      //   path: 'site-howto',
      //   component: SiteHowtoComponent
      // }
    ]
  },
  // {
  //   path: ImitationBox.routePath,
  //   children: [
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
  //   path: ImitationItem.routePath,
  //   children: [
  //     {
  //       path: ':id',
  //       component: ItemComponent,
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
