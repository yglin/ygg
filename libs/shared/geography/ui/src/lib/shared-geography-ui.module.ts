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
import { LocationViewCompactComponent } from './location/location-view-compact/location-view-compact.component';
import { MapNavigatorComponent } from './map/map-navigator/map-navigator.component';
import { LocationControlCompactComponent } from './location/location-control-compact/location-control-compact.component';

@NgModule({
  declarations: [
    AddressControlComponent,
    AddressViewComponent,
    GeoPointControlComponent,
    GeoPointViewComponent,
    GoogleMapComponent,
    LocationControlComponent,
    LocationViewComponent,
    LocationViewCompactComponent,
    MapNavigatorComponent,
    LocationControlCompactComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule
  ],
  exports: [
    LocationControlComponent,
    LocationControlCompactComponent,
    LocationViewComponent,
    LocationViewCompactComponent,
    MapNavigatorComponent
  ]
})
export class SharedGeographyUiModule {}
