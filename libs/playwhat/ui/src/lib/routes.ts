import { Route } from '@angular/router';
// import { TourPlanViewComponent } from './ui/tour-plan-view/tour-plan-view.component';
import {
  ImitationTourPlan,
  ImitationEvent,
  ImitationPlay
} from '@ygg/playwhat/core';
import { TourPlanFactoryService } from './tour-plan-factory.service';
import { TourPlanComponent } from './tour-plan/tour-plan.component';
import { MyTourPlanListComponent } from './tour-plan/my-tour-plan-list/my-tour-plan-list.component';
import { EventComponent } from './event/event/event.component';
import { EventFactoryService } from './event-factory.service';
import { MyEventsComponent } from './event/my-events/my-events.component';
import { MyPlayListComponent } from './play/my-play-list/my-play-list.component';

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
      { path: 'my', component: MyTourPlanListComponent },
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
          tourPlan$: TourPlanFactoryService
        }
      }
    ]
  },
  {
    path: ImitationEvent.routePath,
    children: [
      {
        path: 'my',
        component: MyEventsComponent
      },
      {
        path: ':id',
        component: EventComponent,
        resolve: {
          event$: EventFactoryService
        }
      }
    ]
  },
  {
    path: ImitationPlay.routePath,
    children: [
      { path: 'my', component: MyPlayListComponent },
      {
        path: ':id',
        redirectTo: `/the-things/${ImitationPlay.id}/:id`
      }
    ]
  }
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
