import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ImitationPlay,
  ImitationTour,
  ImitationTourPlan,
  ImitationEquipment,
  RelationshipEquipment
} from '@ygg/playwhat/core';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUserUiModule, UserMenuService } from '@ygg/shared/user/ui';
import { ShoppingUiModule } from '@ygg/shopping/ui';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { TheThingUiModule, TheThingViewsService } from '@ygg/the-thing/ui';
// import { TheThingEditorService } from 'libs/the-thing/ui/src/lib/the-thing-editor.service';
import { routes } from './routes';
import { MyPlayListComponent } from './ui/my-play-list/my-play-list.component';
import { MyTourPlanListComponent } from './ui/my-tour-plan-list/my-tour-plan-list.component';
import { PlayCardComponent } from './ui/play-card/play-card.component';
import { PlayViewComponent } from './ui/play-view/play-view.component';
// import { TourPlanBuilderComponent } from './ui/tour-plan-builder/tour-plan-builder.component';
// import { TourPlanViewComponent } from './ui/tour-plan-view/tour-plan-view.component';
import { TourViewComponent } from './ui/tour-view/tour-view.component';
import { TourPlanFactoryService } from './tour-plan-factory.service';
import { noop } from 'lodash';
import { EquipmentViewComponent } from './ui/equipment/equipment-view/equipment-view.component';
import { PurchaseService } from '@ygg/shopping/factory';
import { TourPlanComponent } from './tour-plan/tour-plan.component';
import { PlayFactoryService } from './play-factory.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedOmniTypesUiModule,
    SharedUserUiModule,
    TheThingUiModule,
    ShoppingUiModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TourViewComponent,
    PlayCardComponent,
    // TourPlanViewComponent,
    // TourPlanBuilderComponent,
    PlayViewComponent,
    MyPlayListComponent,
    MyTourPlanListComponent,
    EquipmentViewComponent,
    TourPlanComponent
  ],
  entryComponents: [
    TourViewComponent,
    // TourPlanViewComponent,
    PlayViewComponent
    // TourPlanBuilderComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configTheThingImitation,
      deps: [
        TheThingImitationAccessService,
        TheThingViewsService,
        // TheThingEditorService
      ],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: configUserMenu,
      deps: [UserMenuService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initFactoryServices,
      deps: [TourPlanFactoryService, PlayFactoryService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: configShoppingModule,
      deps: [PurchaseService],
      multi: true
    }
  ],
  exports: [TourViewComponent, /* TourPlanViewComponent */]
})
export class PlaywhatUiModule {}

export function initFactoryServices(
  tourPlanFactory: TourPlanFactoryService,
  playFactory: PlayFactoryService
) {
  // Do nothing, just to instantiate factory services in advance
  return noop;
}

export function configTheThingImitation(
  imitationAccessService: TheThingImitationAccessService,
  theThingViewsService: TheThingViewsService,
  // theThingEditorService: TheThingEditorService
) {
  return () => {
    imitationAccessService.addLocal([
      ImitationPlay,
      ImitationTour,
      ImitationTourPlan,
      ImitationEquipment
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
    // theThingViewsService.addView('tour-plan', {
    //   id: 'tour-plan',
    //   label: '遊程規劃',
    //   component: TourPlanViewComponent
    // });
    // theThingEditorService.addEditor({
    //   id: 'tour-plan',
    //   label: '遊程規劃',
    //   component: TourPlanBuilderComponent
    // });
  };
}

export function configUserMenu(userMenuService: UserMenuService) {
  return () => {
    userMenuService.addItem({
      id: 'play',
      label: '我的體驗',
      link: `the-things/${ImitationPlay.id}/my`,
      icon: ImitationPlay.icon
    });
    userMenuService.addItem({
      id: 'tour-plan',
      label: '我的遊程',
      link: `the-things/${ImitationTourPlan.id}/my`,
      icon: ImitationTourPlan.icon
    });
  };
}

export function configShoppingModule(purchaseService: PurchaseService) {
  return () => {
    purchaseService.registerAdditionalPurchaseRelations([
      RelationshipEquipment.name
    ]);
  };
}
