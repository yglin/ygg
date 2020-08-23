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
import { SharedUserUiModule } from '@ygg/shared/user/ui';
import { SideDrawerService, SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { pages } from './pages';
import { BoxFactoryService } from './box/box-factory.service';
import { noop } from 'lodash';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoxViewComponent } from './box/box-view/box-view.component';

@NgModule({
  declarations: [
    MapSearchComponent,
    BoxCreateComponent,
    BoxViewComponent,
    MyBoxesComponent,
    HeaderComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUserUiModule,
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
      useFactory: initFactoryServices,
      deps: [BoxFactoryService],
      multi: true
    }
  ]
})
export class OurboxUiModule {}

export function initSideMenu(sideDrawer: SideDrawerService) {
  return async (): Promise<any> => {
    for (const pageId in pages) {
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
