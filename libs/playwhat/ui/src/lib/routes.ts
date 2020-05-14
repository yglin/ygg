import { Route } from '@angular/router';
import { MyPlayListComponent } from './ui/my-play-list/my-play-list.component';
import { MyTourPlanListComponent } from './ui/my-tour-plan-list/my-tour-plan-list.component';
import { TourPlanViewComponent } from './ui/tour-plan-view/tour-plan-view.component';

export const routes: Route[] = [
  // { path: 'plays', children: [{ path: 'my', component: MyPlayListComponent }] },
  {
    path: 'tour-plans',
    children: [
      { path: 'my', component: MyTourPlanListComponent },
      { path: 'create', component: TourPlanViewComponent }
    ]
  }
];
