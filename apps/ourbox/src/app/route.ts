import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';
import { BoxCreateComponent } from './pages/box/box-create/box-create.component';
import { BoardComponent } from './pages/board/board.component';
import { BoxViewComponent } from './pages/box/box-view/box-view.component';
import { ItemViewComponent } from './pages/item/item-view/item-view.component';
import { BoxFactoryService } from './box-factory.service';
import { ImitationItem } from '@ygg/ourbox/core';
import { ItemFactoryService } from './item-factory.service';
import { MyBoxesComponent } from './pages/box/my-boxes/my-boxes.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'ourbox',
    children: [
      {
        path: 'create',
        component: BoxCreateComponent
      },
      {
        path: 'my',
        component: MyBoxesComponent
      },
      {
        path: ':id',
        component: BoxViewComponent,
        resolve: {
          box: BoxFactoryService
        }
      }
    ]
  },
  {
    path: 'board',
    component: BoardComponent
  },
  {
    path: ImitationItem.routePath,
    children: [
      {
        path: ':id',
        component: ItemViewComponent,
        resolve: {
          item$: ItemFactoryService
        }
      }
    ]
  }
];
