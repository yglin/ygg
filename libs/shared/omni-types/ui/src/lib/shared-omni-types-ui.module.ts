import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageUploadModule } from 'angular2-image-upload';

import {
  DateRangeControlComponent,
  DateRangeViewComponent,
  DayTimeControlComponent,
  DayTimeViewComponent,
  DayTimeRangeControlComponent,
  DayTimeRangeViewComponent,
  NumberControlComponent,
  HtmlControlComponent,
  HtmlViewComponent,
  ImageComponent,
  ImageUploaderComponent,
  AlbumControlComponent,
  AlbumViewComponent,
  AlbumComponent,
  ContactControlComponent,
  ContactViewComponent,
  AddressControlComponent,
  AddressViewComponent,
  GeoPointControlComponent,
  GeoPointViewComponent,
  GoogleMapComponent,
  LocationControlComponent,
  LocationViewComponent
} from './types';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CKEditorModule,
    HttpClientModule,
    ImageUploadModule.forRoot(),
    SharedUiNgMaterialModule
  ],
  declarations: [
    HtmlControlComponent,
    HtmlViewComponent,
    DateRangeControlComponent,
    DateRangeViewComponent,
    DayTimeControlComponent,
    DayTimeViewComponent,
    DayTimeRangeControlComponent,
    DayTimeRangeViewComponent,
    NumberControlComponent,
    ImageComponent,
    ImageUploaderComponent,
    AlbumComponent,
    AlbumControlComponent,
    AlbumViewComponent,
    ContactControlComponent,
    ContactViewComponent,
    AddressControlComponent,
    AddressViewComponent,
    GeoPointControlComponent,
    GeoPointViewComponent,
    GoogleMapComponent,
    LocationControlComponent,
    LocationViewComponent
  ],
  exports: [
    HtmlControlComponent,
    HtmlViewComponent,
    DateRangeControlComponent,
    DateRangeViewComponent,
    DayTimeRangeControlComponent,
    DayTimeRangeViewComponent,
    NumberControlComponent,
    ImageComponent,
    ImageUploaderComponent,
    AlbumControlComponent,
    AlbumViewComponent,
    ContactControlComponent,
    ContactViewComponent,
    AddressControlComponent,
    AddressViewComponent,
    GeoPointControlComponent,
    GeoPointViewComponent,
    GoogleMapComponent,
    LocationControlComponent,
    LocationViewComponent
  ],
  entryComponents: [ImageUploaderComponent]
})
export class SharedOmniTypesUiModule {}
