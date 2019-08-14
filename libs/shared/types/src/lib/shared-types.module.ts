import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DynamicFormsCoreModule } from "@ng-dynamic-forms/core";
import { DynamicFormsMaterialUIModule } from "@ng-dynamic-forms/ui-material";
import { ImageUploadModule } from "angular2-image-upload";
import { ContactComponent, ContactFormComponent } from './contact';
import { DateRangeComponent, DateRangePickerComponent } from './date-range';
import {
  NumberRangeComponent,
  NumberRangeControlComponent
} from './number-range';
import { TagsComponent } from './tags/tags.component';
import { TagsInputComponent } from './tags/tags-input/tags-input.component';
import { DateRangePickerDialogComponent } from './date-range/date-range-picker/date-range-picker-dialog/date-range-picker-dialog.component';
import { AlbumComponent } from './album/album.component';
import { ImageComponent } from './image/image.component';
import { FormControlComponent } from './form/form-control/form-control.component';
import { AlbumControlComponent } from './album/album-control/album-control.component';
import { ImageUploaderComponent } from './image/image-uploader/image-uploader.component';
import { SharedInfraDataAccessModule } from '@ygg/shared/infra/data-access';
import { BusinessHoursControlComponent } from './business-hours/business-hours-control/business-hours-control.component';
import { BusinessHoursViewComponent } from './business-hours/business-hours-view/business-hours-view.component';
import { DayTimeRangeControlComponent, DayTimeRangeComponent } from './day-time-range';
import { OpenHourComponent } from './business-hours/open-hour/open-hour.component';
import { WeekDayPipePipe } from './week-day/week-day-pipe.pipe';
import { DayTimeControlComponent } from './day-time/day-time-control/day-time-control.component';
import { LocationControlComponent } from './location/location-control/location-control.component';
import { LocationViewComponent } from './location/location-view/location-view.component';
import { AddressControlComponent } from './address/address-control/address-control.component';
import { AddressViewComponent } from './address/address-view/address-view.component';
import { GeoPointControlComponent } from './geo-point/geo-point-control/geo-point-control.component';
import { GeoPointViewComponent } from './geo-point/geo-point-view/geo-point-view.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDaterangepickerMd.forRoot({
      applyLabel: '確定',
      cancelLabel: '取消',
      format: 'YYYY/MM/DD'
    }),
    HttpClientModule,
    ImageUploadModule.forRoot(),
    SharedInfraDataAccessModule,
    DynamicFormsCoreModule,
    DynamicFormsMaterialUIModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
  ],
  declarations: [
    NumberRangeComponent,
    NumberRangeControlComponent,
    DateRangeComponent,
    DateRangePickerComponent,
    ContactComponent,
    ContactFormComponent,
    TagsComponent,
    TagsInputComponent,
    DateRangePickerDialogComponent,
    AlbumComponent,
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
    LocationControlComponent,
    LocationViewComponent,
    AddressControlComponent,
    AddressViewComponent,
    GeoPointControlComponent,
    GeoPointViewComponent
  ],
  entryComponents: [DateRangePickerDialogComponent, ImageUploaderComponent],
  exports: [
    NumberRangeComponent,
    NumberRangeControlComponent,
    DateRangeComponent,
    DateRangePickerComponent,
    ContactComponent,
    ContactFormComponent,
    TagsComponent,
    TagsInputComponent,
    AlbumComponent,
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
    LocationControlComponent,
    LocationViewComponent,
    AddressControlComponent,
    AddressViewComponent,
    GeoPointControlComponent,
    GeoPointViewComponent,
  ]
})
export class SharedTypesModule {}
