import { Route } from '@angular/router';
import { MyPlayListComponent } from './ui/my-play-list/my-play-list.component';
import { MyTourPlanListComponent } from './ui/my-tour-plan-list/my-tour-plan-list.component';
import { TourPlanViewComponent } from './ui/tour-plan-view/tour-plan-view.component';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { TourPlanFactoryService } from './tour-plan-factory.service';

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
        component: TourPlanViewComponent,
        resolve: {
          tourPlan: TourPlanFactoryService
        }
      }
    ]
  }
];
