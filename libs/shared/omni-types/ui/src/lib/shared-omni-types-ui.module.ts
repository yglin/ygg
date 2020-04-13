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
  LocationViewComponent,
  BusinessHoursControlComponent,
  BusinessHoursViewComponent,
  OpenHourComponent
} from './types';
import { HttpClientModule } from '@angular/common/http';
import { TextControlComponent } from './types/text/text-control/text-control.component';
import { OmniTypeControlComponent } from './omni-type/omni-type-control/omni-type-control.component';
import { OmniTypeViewComponent } from './omni-type/omni-type-view/omni-type-view.component';
import { OmniTypeViewControlComponent } from './omni-type/omni-type-view-control/omni-type-view-control.component';
import { NumberViewComponent } from './types/number/number-view/number-view.component';
import { TextViewComponent } from './types/text/text-view/text-view.component';
import { LongTextViewComponent } from './types/long-text/long-text-view/long-text-view.component';
import { LongTextControlComponent } from './types/long-text/long-text-control/long-text-control.component';

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
    LocationViewComponent,
    BusinessHoursControlComponent,
    BusinessHoursViewComponent,
    OpenHourComponent,
    TextControlComponent,
    OmniTypeControlComponent,
    OmniTypeViewComponent,
    OmniTypeViewControlComponent,
    NumberViewComponent,
    TextViewComponent,
    LongTextViewComponent,
    LongTextControlComponent
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
    LocationViewComponent,
    BusinessHoursControlComponent,
    BusinessHoursViewComponent,
    OpenHourComponent,
    TextControlComponent,
    OmniTypeControlComponent,
    OmniTypeViewControlComponent
  ],
  entryComponents: [ImageUploaderComponent]
})
export class SharedOmniTypesUiModule {}
