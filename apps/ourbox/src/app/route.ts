import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';
import { BoxCreateComponent } from './pages/box/box-create/box-create.component';
import { BoardComponent } from './pages/board/board.component';
import { BoxViewComponent } from './pages/box/box-view/box-view.component';
import { ItemViewComponent } from './pages/item/item-view/item-view.component';

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
    path: 'boxes',
    children: [
      {
        path: 'create',
        component: BoxCreateComponent
      },
      {
        path: ':id',
        component: BoxViewComponent
      }
    ]
  },
  {
    path: 'board',
    component: BoardComponent
  },
  {
    path: 'items',
    children: [
      {
        path: ':id',
        component: ItemViewComponent
      }
    ]
  }
];
