import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { TourViewComponent } from './ui/tour-view/tour-view.component';
import { TheThingUiModule, TheThingViewsService } from '@ygg/the-thing/ui';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { PlayCardComponent } from './ui/play-card/play-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TourPlanViewComponent } from './ui/tour-plan-view/tour-plan-view.component';
import { TheThingConfig } from './the-thing-config';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { TourPlanBuilderPageObject } from './ui';
import { TourPlanBuilderComponent } from './ui/tour-plan-builder/tour-plan-builder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { Image } from '@ygg/shared/omni-types/core';
import { TourPlanAdminComponent } from './ui/tour-plan-admin/tour-plan-admin.component';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { PlayViewComponent } from './ui/play-view/play-view.component';
import { SharedUserModule } from '@ygg/shared/user';
import {
  ImitationPlay,
  ImitationTour,
  ImitationTourPlan
} from '@ygg/playwhat/core';
import { ShoppingUiModule } from '@ygg/shopping/ui';

export const playwhatTourRoutes: Route[] = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedOmniTypesUiModule,
    SharedUserModule,
    TheThingUiModule,
    ShoppingUiModule
  ],
  declarations: [
    TourViewComponent,
    PlayCardComponent,
    TourPlanViewComponent,
    TourPlanBuilderComponent,
    TourPlanAdminComponent,
    PlayViewComponent
  ],
  entryComponents: [
    TourViewComponent,
    TourPlanViewComponent,
    TourPlanAdminComponent,
    PlayViewComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configTheThingImitation,
      deps: [TheThingImitationAccessService, TheThingViewsService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: configAdminMenu,
      deps: [PlaywhatAdminService],
      multi: true
    }
  ],
  exports: [TourViewComponent, TourPlanBuilderComponent, TourPlanAdminComponent]
})
export class PlaywhatUiModule {}

export function configTheThingImitation(
  imitationAccessService: TheThingImitationAccessService,
  theThingViewsService: TheThingViewsService
) {
  return () => {
    imitationAccessService.addLocal([
      ImitationPlay,
      ImitationTour,
      ImitationTourPlan
    ]);
    theThingViewsService.addView('play', {
      id: 'play',
      label: '體驗',
      component: PlayViewComponent
    });
    theThingViewsService.addView('tour', {
      id: 'tour',
      label: '體驗組合',
      component: TourViewComponent
    });
    theThingViewsService.addView('tour-plan', {
      id: 'tour-plan',
      label: '遊程規劃',
      component: TourPlanViewComponent
    });
  };
}

export function configAdminMenu(
  playwhatAdminService: PlaywhatAdminService
): Function {
  const adminMenu = new MenuTree({
    id: 'tour-plans',
    link: 'tour-plans',
    label: '遊程規劃清單',
    icon: new Image('/assets/images/tour/tour-plans.svg'),
    tooltip: '遊程規劃清單管理頁面',
    component: TourPlanAdminComponent
  });
  return () => {
    playwhatAdminService.menu.addMenu(adminMenu);
  };
}
