import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MapSearchComponent } from './map/map-search/map-search.component';
import { RouterModule } from '@angular/router';
import { pages, pagesInSideDrawer } from '@ygg/ourbox/core';
// import { SiteHowtoComponent } from './misc/site-howto/site-howto.component';
import { SharedCustomPageUiModule } from '@ygg/shared/custom-page/ui';
import { SharedGeographyUiModule } from '@ygg/shared/geography/ui';
// import { ItemTransferCompleteComponent } from './item-transfer/item-transfer-complete/item-transfer-complete.component';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedTagsUiModule } from '@ygg/shared/tags/ui';
// import { ItemWarehouseComponent } from './item/item-warehouse/item-warehouse.component';
// import { TheThingUiModule } from '@ygg/the-thing/ui';
// import { ItemComponent } from './item/item/item.component';
// import { MyHeldItemsComponent } from './item/my-held-items/my-held-items.component';
// import { ItemTransferComponent } from './item-transfer/item-transfer/item-transfer.component';
// import { MyItemTransfersComponent } from './item-transfer/my-item-transfers/my-item-transfers.component';
import { SharedThreadUiModule } from '@ygg/shared/thread/ui';
import { SideDrawerService } from '@ygg/shared/ui/navigation';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import {
  SharedUserUiModule,
  UserMenuItem,
  UserMenuService
} from '@ygg/shared/user/ui';
import { noop, pick, values } from 'lodash';
import { BoxAgentService } from './box/box-agent.service';
// import { HomeComponent } from './home/home.component';
import { BoxCreateComponent } from './box/box-create/box-create.component';
import { BoxFactoryService } from './box/box-factory.service';
import { BoxViewComponent } from './box/box-view/box-view.component';
import { MyBoxesComponent } from './box/my-boxes/my-boxes.component';
import { HeadQuarterService } from './head-quarter.service';
import { HeaderComponent } from './layout/header/header.component';
import { routes } from './route';
import { TreasureMapComponent } from './treasure-map/treasure-map.component';
import { MyTreasuresComponent } from './treasure/my-treasures/my-treasures.component';
import { TreasureCreateComponent } from './treasure/treasure-create/treasure-create.component';
// import { OurboxTourGuideService } from './ourbox-tour-guide.service';
import { TreasureEditComponent } from './treasure/treasure-edit/treasure-edit.component';
import { TreasureViewComponent } from './treasure/treasure-view/treasure-view.component';
import { BoxThumbnailComponent } from './box/box-thumbnail/box-thumbnail.component';

export function initSideMenu(
  sideDrawer: SideDrawerService,
  hq: HeadQuarterService
) {
  return async (): Promise<any> => {
    for (const pageId in pick(pages, pagesInSideDrawer)) {
      if (Object.prototype.hasOwnProperty.call(pages, pageId)) {
        const page = pages[pageId];
        sideDrawer.addPageLink(page);
        if (page.event) {
          hq.connect(sideDrawer.eventEmitter, page.event.name);
        }
      }
    }
    return Promise.resolve();
  };
}

export function initFactoryServices(boxFactory: BoxFactoryService) {
  // Do nothing, just to call constructors of factories
  return noop;
}

export function configUserMenu(userMenuService: UserMenuService) {
  return () => {
    const userPages = values(
      pick(pages, ['myBoxes', 'myHeldItems', 'myItemTransfers'])
    );
    for (const page of userPages) {
      userMenuService.addItem(UserMenuItem.fromPage(page));
    }
  };
}

export function initAgents(boxAgent: BoxAgentService) {
  return () => {
    // Do nothing for now, only to call constructors of agent services
  };
}

@NgModule({
  declarations: [
    // MapSearchComponent,
    BoxCreateComponent,
    BoxViewComponent,
    MyBoxesComponent,
    HeaderComponent,
    // HomeComponent,
    // ItemWarehouseComponent,
    // ItemComponent,
    // MyHeldItemsComponent,
    // ItemTransferComponent,
    // ItemTransferCompleteComponent,
    // MyItemTransfersComponent,
    // SiteHowtoComponent,
    TreasureEditComponent,
    TreasureCreateComponent,
    TreasureViewComponent,
    MyTreasuresComponent,
    TreasureMapComponent,
    BoxThumbnailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUserUiModule,
    SharedThreadUiModule,
    SharedOmniTypesUiModule,
    // TheThingUiModule,
    SharedCustomPageUiModule,
    SharedGeographyUiModule,
    SharedTagsUiModule,
    RouterModule.forChild(routes)
  ],
  exports: [HeaderComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initSideMenu,
      deps: [SideDrawerService, HeadQuarterService],
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
      useFactory: initAgents,
      deps: [BoxAgentService],
      multi: true
    }
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: (actionBeacon, ourboxTourGuide) => () =>
    //     connectUiActions(actionBeacon, ourboxTourGuide),
    //   deps: [ActionBeaconService, OurboxTourGuideService],
    //   multi: true
    // }
  ]
})
export class OurboxUiModule {}
