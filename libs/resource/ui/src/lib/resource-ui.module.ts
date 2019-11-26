import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceControlComponent } from './resource/resource-control/resource-control.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { EquipmentControlComponent } from './equipment/equipment-control/equipment-control.component';
import { SharedUiDynamicFormModule } from '@ygg/shared/ui/dynamic-form';
import { EquipmentThumbnailComponent } from './equipment/equipment-thumbnail/equipment-thumbnail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUiDynamicFormModule
  ],
  declarations: [ResourceControlComponent, EquipmentControlComponent, EquipmentThumbnailComponent],
  exports: [ResourceControlComponent, EquipmentControlComponent, EquipmentThumbnailComponent]
})
export class ResourceUiModule {}
