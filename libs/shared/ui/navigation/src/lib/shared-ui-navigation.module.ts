import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GridMenuComponent } from './menu/grid-menu/grid-menu.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedTypesModule } from '@ygg/shared/types';

@NgModule({
  declarations: [GridMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    SharedTypesModule
  ],
  exports: [GridMenuComponent]
})
export class SharedUiNavigationModule {}
