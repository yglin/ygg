import { TourViewComponent } from './ui/tour-view/tour-view.component';
// import { TourPlanViewComponent } from './ui/tour-plan-view/tour-plan-view.component';

export const TheThingConfig = {
  imitations: [
    {
      id: 'tour',
      name: '遊程(體驗組合)',
      view: {
        component: TourViewComponent
      }
    }/* , {
      id: 'tour-plan',
      name: '遊程計畫',
      view: {
        component: TourPlanViewComponent
      }
    }     */
  ]
}