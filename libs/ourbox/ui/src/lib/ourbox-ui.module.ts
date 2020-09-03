import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapSearchComponent } from './map/map-search/map-search.component';
import { RouterModule } from '@angular/router';
import { routes } from './route';
import { HomeComponent } from './home/home.component';
import { BoxCreateComponent } from './box/box-create/box-create.component';
import { MyBoxesComponent } from './box/my-boxes/my-boxes.component';
import { HeaderComponent } from './layout/header/header.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  SharedUserUiModule,
  UserMenuService,
  UserMenuItem
} from '@ygg/shared/user/ui';
import {
  SideDrawerService,
  SharedUiWidgetsModule
} from '@ygg/shared/ui/widgets';
import { pages } from './pages';
import { BoxFactoryService } from './box/box-factory.service';
import { noop, pick, values } from 'lodash';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoxViewComponent } from './box/box-view/box-view.component';
import { ItemWarehouseComponent } from './item/item-warehouse/item-warehouse.component';
import { TheThingUiModule } from '@ygg/the-thing/ui';
import { ItemComponent } from './item/item/item.component';
import { MyHeldItemsComponent } from './item/my-held-items/my-held-items.component';
import { ItemTransferComponent } from './item-transfer/item-transfer/item-transfer.component';
import { MyItemTransfersComponent } from './item-transfer/my-item-transfers/my-item-transfers.component';
import { SharedThreadUiModule } from '@ygg/shared/thread/ui';
import { ItemTransferCompleteComponent } from './item-transfer/item-transfer-complete/item-transfer-complete.component';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';

@NgModule({
  declarations: [
    MapSearchComponent,
    BoxCreateComponent,
    BoxViewComponent,
    MyBoxesComponent,
    HeaderComponent,
    HomeComponent,
    ItemWarehouseComponent,
    ItemComponent,
    MyHeldItemsComponent,
    ItemTransferComponent,
    ItemTransferCompleteComponent,
    MyItemTransfersComponent
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
    TheThingUiModule,
    RouterModule.forChild(routes)
  ],
  exports: [MapSearchComponent, HeaderComponent, HomeComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initSideMenu,
      deps: [SideDrawerService],
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
      deps: [BoxFactoryService],
      multi: true
    }
  ]
})
export class OurboxUiModule {}

export function initSideMenu(sideDrawer: SideDrawerService) {
  return async (): Promise<any> => {
    for (const pageId in pick(pages, [
      'mapSearch',
      'boxCreate',
      'itemWarehouse'
    ])) {
      if (Object.prototype.hasOwnProperty.call(pages, pageId)) {
        const page = pages[pageId];
        sideDrawer.addPageLink(page);
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
