import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedUiNgMaterialModule } from "@ygg/shared/ui/ng-material";

import { routes } from './routes';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceThumbnailComponent } from './resource-thumbnail/resource-thumbnail.component';
import { ResourceSelectorComponent } from './resource-selector/resource-selector.component';


@NgModule({
  declarations: [ResourceListComponent, ResourceThumbnailComponent, ResourceSelectorComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule
  ],
  exports: [
    ResourceListComponent,
    ResourceSelectorComponent
  ]
})
export class ResourceFrontendModule { }


@NgModule({
  declarations: [],
  imports: [
    ResourceFrontendModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    ResourceFrontendModule
  ]
})
export class ResourceFrontendFeatureModule { }
