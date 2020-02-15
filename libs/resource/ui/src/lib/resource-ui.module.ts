import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceControlComponent } from './resource/resource-control/resource-control.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { AdditionControlComponent } from './addition/addition-control/addition-control.component';
import { SharedUiDynamicFormModule } from '@ygg/shared/ui/dynamic-form';
import { AdditionThumbnailComponent } from './addition/addition-thumbnail/addition-thumbnail.component';
import { AccommodationListComponent } from './accommodation/accommodation-list/accommodation-list.component';
import { AccommodationControlComponent } from './accommodation/accommodation-control/accommodation-control.component';
import { AccommodationThumbnailComponent } from './accommodation/accommodation-thumbnail/accommodation-thumbnail.component';
import { RouterModule } from '@angular/router';
import { AccommodationEditComponent } from './pages/accommodation-edit/accommodation-edit.component';
import { routes } from "./routes";
import { AccommodationDetailComponent } from './pages/accommodation-detail/accommodation-detail.component';
import { AccommodationViewComponent } from './accommodation/accommodation-view/accommodation-view.component';
import { SharedTypesModule } from '@ygg/shared/types';
import { SharedOmniTypesUiModule } from "@ygg/shared/omni-types/ui";

@NgModule({
  imports: [
    CommonModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUiDynamicFormModule,
    SharedTypesModule,
    SharedOmniTypesUiModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ResourceControlComponent, AdditionControlComponent, AdditionThumbnailComponent, AccommodationListComponent, AccommodationControlComponent, AccommodationThumbnailComponent, AccommodationEditComponent, AccommodationDetailComponent, AccommodationViewComponent],
  exports: [ResourceControlComponent, AdditionControlComponent, AdditionThumbnailComponent, AccommodationListComponent]
})
export class ResourceUiModule {}
