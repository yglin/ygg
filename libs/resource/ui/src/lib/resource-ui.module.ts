import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceControlComponent } from './resource/resource-control/resource-control.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { EquipmentControlComponent } from './equipment/equipment-control/equipment-control.component';
import { SharedUiDynamicFormModule } from '@ygg/shared/ui/dynamic-form';
import { EquipmentThumbnailComponent } from './equipment/equipment-thumbnail/equipment-thumbnail.component';
import { AccommodationListComponent } from './accommodation/accommodation-list/accommodation-list.component';
import { AccommodationControlComponent } from './accommodation/accommodation-control/accommodation-control.component';
import { AccommodationThumbnailComponent } from './accommodation/accommodation-thumbnail/accommodation-thumbnail.component';
import { RouterModule } from '@angular/router';
import { AccommodationEditComponent } from './pages/accommodation-edit/accommodation-edit.component';
import { routes } from "./routes";
import { AccommodationDetailComponent } from './pages/accommodation-detail/accommodation-detail.component';
import { AccommodationViewComponent } from './accommodation/accommodation-view/accommodation-view.component';
import { SharedTypesModule } from '@ygg/shared/types';

@NgModule({
  imports: [
    CommonModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUiDynamicFormModule,
    SharedTypesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ResourceControlComponent, EquipmentControlComponent, EquipmentThumbnailComponent, AccommodationListComponent, AccommodationControlComponent, AccommodationThumbnailComponent, AccommodationEditComponent, AccommodationDetailComponent, AccommodationViewComponent],
  exports: [ResourceControlComponent, EquipmentControlComponent, EquipmentThumbnailComponent, AccommodationListComponent]
})
export class ResourceUiModule {}
