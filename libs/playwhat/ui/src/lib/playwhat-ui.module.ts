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
import { SharedUserModule, UserMenuService } from '@ygg/shared/user';
import {
  ImitationPlay,
  ImitationTour,
  ImitationTourPlan
} from '@ygg/playwhat/core';
import { ShoppingUiModule } from '@ygg/shopping/ui';
import { MyPlayListComponent } from './ui/my-play-list/my-play-list.component';
import { routes } from './routes';
import { MyTourPlanListComponent } from './ui/my-tour-plan-list/my-tour-plan-list.component';
import { TheThingEditorService } from 'libs/the-thing/ui/src/lib/the-thing-editor.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
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
    PlayViewComponent,
    MyPlayListComponent,
    MyTourPlanListComponent
  ],
  entryComponents: [
    TourViewComponent,
    TourPlanViewComponent,
    TourPlanAdminComponent,
    PlayViewComponent,
    TourPlanBuilderComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configTheThingImitation,
      deps: [
        TheThingImitationAccessService,
        TheThingViewsService,
        TheThingEditorService
      ],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: configUserMenu,
      deps: [UserMenuService],
      multi: true
    }
  ],
  exports: [TourViewComponent, TourPlanBuilderComponent, TourPlanAdminComponent]
})
export class PlaywhatUiModule {}

export function configTheThingImitation(
  imitationAccessService: TheThingImitationAccessService,
  theThingViewsService: TheThingViewsService,
  theThingEditorService: TheThingEditorService
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
    theThingEditorService.addEditor({
      id: 'tour-plan',
      label: '遊程規劃',
      component: TourPlanBuilderComponent
    });
  };
}

export function configUserMenu(userMenuService: UserMenuService) {
  return () => {
    userMenuService.addItem({
      id: 'play',
      label: '我的體驗',
      link: `the-things/my/${ImitationPlay.id}`,
      icon: ImitationPlay.icon
    });
    userMenuService.addItem({
      id: 'tour-plan',
      label: '我的遊程',
      link: `the-things/my/${ImitationTourPlan.id}`,
      icon: ImitationTourPlan.icon
    });
  };
}
