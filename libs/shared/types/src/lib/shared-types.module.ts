import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
// import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ImageUploadModule } from 'angular2-image-upload';
import { DateRangeComponent, DateRangePickerComponent } from './date-range';
import {
  NumberRangeComponent,
  NumberRangeControlComponent
} from './number-range';
// import { DateRangePickerDialogComponent } from './date-range/date-range-picker/date-range-picker-dialog/date-range-picker-dialog.component';
import { AlbumViewComponent } from './album/album-view/album-view.component';
import { ImageComponent } from './image/image.component';
import { FormControlComponent } from './form';
import { AlbumControlComponent } from './album/album-control/album-control.component';
import { ImageUploaderComponent } from './image/image-uploader/image-uploader.component';
import { SharedInfraDataAccessModule } from '@ygg/shared/infra/data-access';
import { BusinessHoursControlComponent } from './business-hours/business-hours-control/business-hours-control.component';
import { BusinessHoursViewComponent } from './business-hours/business-hours-view/business-hours-view.component';
import {
  DayTimeRangeControlComponent,
  DayTimeRangeComponent
} from './day-time-range';
import { OpenHourComponent } from './business-hours/open-hour/open-hour.component';
import { WeekDayPipePipe } from './week-day/week-day-pipe.pipe';
import { DayTimeControlComponent } from './day-time/day-time-control/day-time-control.component';
// import { LocationControlComponent } from './location/location-control/location-control.component';
// import { LocationViewComponent } from './location/location-view/location-view.component';
// import { AddressControlComponent } from './location/address/address-control/address-control.component';
// import { AddressViewComponent } from './location/address/address-view/address-view.component';
// import { GeoPointControlComponent, GeoPointViewComponent } from './location/geo-point';
// import { AgmCoreModule } from '@agm/core';
import {
  AddressControlComponent,
  AddressViewComponent,
  GeoPointControlComponent,
  GeoPointViewComponent,
  LocationControlComponent,
  LocationViewComponent,
  GoogleMapComponent
} from './location';
import { AlbumComponent } from './album/album.component';
import { TagsControlComponent, TagsViewComponent } from './tags';
import { ContactControlComponent, ContactViewComponent } from './contact';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    // NgxDaterangepickerMd.forRoot({
    //   applyLabel: '確定',
    //   cancelLabel: '取消',
    //   format: 'YYYY/MM/DD'
    // }),
    HttpClientModule,
    ImageUploadModule.forRoot(),
    SharedInfraDataAccessModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBxqFHIHMhy8UdOPpCHrzB-Ktjngsa_UjI',
    //   language: 'zh-TW'
    // })
  ],
  declarations: [
    NumberRangeComponent,
    NumberRangeControlComponent,
    DateRangeComponent,
    DateRangePickerComponent,
    // DateRangePickerDialogComponent,
    AlbumViewComponent,
    ImageComponent,
    FormControlComponent,
    AlbumControlComponent,
    ImageUploaderComponent,
    BusinessHoursControlComponent,
    BusinessHoursViewComponent,
    DayTimeRangeControlComponent,
    OpenHourComponent,
    DayTimeRangeComponent,
    WeekDayPipePipe,
    DayTimeControlComponent,
    // LocationControlComponent,
    // LocationViewComponent,
    AddressControlComponent,
    AddressViewComponent,
    GeoPointControlComponent,
    GeoPointViewComponent,
    LocationControlComponent,
    LocationViewComponent,
    GoogleMapComponent,
    AlbumComponent,
    TagsControlComponent,
    TagsViewComponent,
    ContactControlComponent,
    ContactViewComponent
  ],
  entryComponents: [/* DateRangePickerDialogComponent, */ImageUploaderComponent],
  exports: [
    NumberRangeComponent,
    NumberRangeControlComponent,
    DateRangeComponent,
    DateRangePickerComponent,
    AlbumViewComponent,
    ImageComponent,
    FormControlComponent,
    AlbumControlComponent,
    ImageUploaderComponent,
    BusinessHoursControlComponent,
    BusinessHoursViewComponent,
    DayTimeRangeControlComponent,
    OpenHourComponent,
    DayTimeRangeComponent,
    DayTimeControlComponent,
    // LocationControlComponent,
    // LocationViewComponent,
    AddressControlComponent,
    AddressViewComponent,
    GeoPointControlComponent,
    GeoPointViewComponent,
    LocationControlComponent,
    LocationViewComponent,
    GoogleMapComponent,
    ContactControlComponent,
    ContactViewComponent,
    // TagsControlComponent,
    // TagsViewComponent
  ]
})
export class SharedTypesModule {}
