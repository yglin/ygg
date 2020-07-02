import { Route } from '@angular/router';
// import { TourPlanViewComponent } from './ui/tour-plan-view/tour-plan-view.component';
import { ImitationTourPlan, ImitationEvent } from '@ygg/playwhat/core';
import { TourPlanFactoryService } from './tour-plan-factory.service';
import { TourPlanComponent } from './tour-plan/tour-plan.component';
import { EventComponent } from './event/event.component';
import { EventFactoryService } from './event-factory.service';

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
        component: TourPlanComponent,
        resolve: {
          tourPlan: TourPlanFactoryService
        }
      }
    ]
  },
  {
    path: ImitationEvent.routePath,
    children: [
      {
        path: ':id',
        component: EventComponent,
        resolve: {
          event$: EventFactoryService
        }
      }
    ]
  }
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
