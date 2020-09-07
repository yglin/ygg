import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GridMenuComponent } from './menu/grid-menu/grid-menu.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { LayoutPageClassicComponent } from './layout/layout-page-classic/layout-page-classic.component';
import { SideDrawerComponent } from './layout/side-drawer/side-drawer.component';

@NgModule({
  declarations: [
    GridMenuComponent,
    LayoutPageClassicComponent,
    SideDrawerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    SharedOmniTypesUiModule
  ],
  entryComponents: [GridMenuComponent],
  exports: [GridMenuComponent, LayoutPageClassicComponent, SideDrawerComponent]
})
export class SharedUiNavigationModule {}
