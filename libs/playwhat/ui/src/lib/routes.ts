import { Route } from '@angular/router';
import { MyPlayListComponent } from './ui/my-play-list/my-play-list.component';
import { MyTourPlanListComponent } from './ui/my-tour-plan-list/my-tour-plan-list.component';
import { TourPlanViewComponent } from './ui/tour-plan-view/tour-plan-view.component';
import { ImitationTourPlan, ImitationPlay, ImitationEquipment } from '@ygg/playwhat/core';
import { TourPlanFactoryService } from './tour-plan-factory.service';
import { PlayViewComponent } from './ui/play-view/play-view.component';
import { PlayFactoryService } from './play-factory.service';
import { EquipmentViewComponent } from './ui/equipment/equipment-view/equipment-view.component';
import { EquipmentFactoryService } from './equipment-factory.service';

export const routes: Route[] = [
  // { path: 'plays', children: [{ path: 'my', component: MyPlayListComponent }] },
  // {
  //   path: 'tour-plan',
  //   children: [
  //     { path: 'my', component: MyTourPlanListComponent },
  //     // { path: 'create', component: TourPlanViewComponent }
  //   ]
  // },
  {
    path: ImitationTourPlan.routePath,
    children: [
      // { path: 'my', component: MyTourPlanListComponent },
      // {
      //   path: 'create',
      //   component: TourPlanViewComponent,
      //   resolve: {
      //     tourPlan: TourPlanFactoryService
      //   }
      // },
      {
        path: ':id',
        component: TourPlanViewComponent,
        resolve: {
          tourPlan: TourPlanFactoryService
        }
      }
    ]
  },
  // {
  //   path: ImitationPlay.routePath,
  //   children: [
  //     { path: 'my', component: MyPlayListComponent },
  //     {
  //       path: ':id',
  //       component: PlayViewComponent,
  //       resolve: {
  //         play: PlayFactoryService
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: ImitationEquipment.routePath,
  //   children: [
  //     {
  //       path: ':id',
  //       component: EquipmentViewComponent,
  //       resolve: {
  //         equipment: EquipmentFactoryService
  //       }
  //     }
  //   ]
  // }  
];
