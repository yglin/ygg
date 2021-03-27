import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddressControlComponent,
  AddressViewComponent,
  GeoPointControlComponent,
  GeoPointViewComponent,
  GoogleMapComponent,
  LocationControlComponent,
  LocationViewComponent
} from './location';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';

@NgModule({
  declarations: [
    AddressControlComponent,
    AddressViewComponent,
    GeoPointControlComponent,
    GeoPointViewComponent,
    GoogleMapComponent,
    LocationControlComponent,
    LocationViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule
  ],
  exports: [LocationControlComponent, LocationViewComponent]
})
export class SharedGeographyUiModule {}
