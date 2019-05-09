import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SharedUiNgMaterialModule} from '@ygg/shared/ui/ng-material';

import {ResourceListComponent} from './resource-list/resource-list.component';
import {ResourceSelectorComponent} from './resource-selector/resource-selector.component';
import {ResourceThumbnailComponent} from './resource-thumbnail/resource-thumbnail.component';


@NgModule({
  declarations: [
    ResourceListComponent, ResourceThumbnailComponent, ResourceSelectorComponent
  ],
  imports: [CommonModule, FlexLayoutModule, SharedUiNgMaterialModule],
  exports: [ResourceListComponent, ResourceSelectorComponent]
})
export class SharedDomainResourceModule {
}
