import { CommonModule, registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ImitationPlay,
  ImitationTourPlan,
  ImitationEquipment,
  RelationshipEquipment,
  ImitationEvent,
  TheThingImitations
} from '@ygg/playwhat/core';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUserUiModule, UserMenuService } from '@ygg/shared/user/ui';
import { ShoppingUiModule } from '@ygg/shopping/ui';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { ImitationFactoryService, TheThingUiModule } from '@ygg/the-thing/ui';
// import { TheThingEditorService } from 'libs/the-thing/ui/src/lib/the-thing-editor.service';
import { routes } from './routes';
import { MyPlayListComponent } from './play/my-play-list/my-play-list.component';
import { MyTourPlanListComponent } from './tour-plan/my-tour-plan-list/my-tour-plan-list.component';
// import { PlayCardComponent } from './ui/play-card/play-card.component';
// import { PlayViewComponent } from './ui/play-view/play-view.component';
// import { TourPlanBuilderComponent } from './ui/tour-plan-builder/tour-plan-builder.component';
// import { TourPlanViewComponent } from './ui/tour-plan-view/tour-plan-view.component';
// import { TourViewComponent } from './ui/tour-view/tour-view.component';
import { TourPlanFactoryService } from './tour-plan-factory.service';
import { noop } from 'lodash';
// import { EquipmentViewComponent } from './ui/equipment/equipment-view/equipment-view.component';
import { PurchaseService } from '@ygg/shopping/factory';
import { TourPlanComponent } from './tour-plan/tour-plan.component';
import { PlayFactoryService } from './play-factory.service';
import { EventComponent } from './event/event/event.component';
import { MyHostEventsComponent } from './event/my-host-events/my-host-events.component';
import { SharedThreadUiModule } from '@ygg/shared/thread/ui';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MyCalendarComponent } from './event/calendar/my-calendar/my-calendar.component';
import { MyEventsComponent } from './event/my-events/my-events.component';
// import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
// import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
// import momentPlugin from '@fullcalendar/moment';

// FullCalendarModule.registerPlugins([
//   // register FullCalendar plugins
//   dayGridPlugin,
//   momentPlugin
// ]);
import localeZhHant from '@angular/common/locales/zh-Hant';
registerLocaleData(localeZhHant);

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
    SharedThreadUiModule,
    TheThingUiModule,
    ShoppingUiModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [
    // TourViewComponent,
    // PlayCardComponent,
    // TourPlanViewComponent,
    // TourPlanBuilderComponent,
    // PlayViewComponent,
    MyPlayListComponent,
    MyTourPlanListComponent,
    // EquipmentViewComponent,
    TourPlanComponent,
    EventComponent,
    MyHostEventsComponent,
    MyCalendarComponent,
    MyEventsComponent
  ],
  entryComponents: [
    // TourViewComponent,
    // TourPlanViewComponent,
    // PlayViewComponent
    // TourPlanBuilderComponent
  ],
  providers: [
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
      useFactory: configTheThingModule,
      deps: [ImitationFactoryService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: configShoppingModule,
      deps: [PurchaseService],
      multi: true
    }
  ]
  // exports: [TourViewComponent /* TourPlanViewComponent */]
})
export class PlaywhatUiModule {}

export function initFactoryServices(
  tourPlanFactory: TourPlanFactoryService,
  playFactory: PlayFactoryService
) {
  // Do nothing, just to instantiate factory services in advance
  return noop;
}

export function configTheThingModule(
  imitationFactory: ImitationFactoryService
) {
  return () => {
    TheThingImitations.forEach(imitation =>
      imitationFactory.registerImitation(imitation)
    );
  };
}

export function configUserMenu(userMenuService: UserMenuService) {
  return () => {
    userMenuService.addItem({
      id: 'play',
      label: '我的體驗',
      link: `${ImitationPlay.routePath}/my`,
      icon: ImitationPlay.icon
    });
    userMenuService.addItem({
      id: 'tour-plan',
      label: '我的遊程',
      link: `${ImitationTourPlan.routePath}/my`,
      icon: ImitationTourPlan.icon
    });
    userMenuService.addItem({
      id: 'my-events',
      label: '我的行程',
      link: `${ImitationEvent.routePath}/my`,
      icon: ImitationEvent.icon
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
