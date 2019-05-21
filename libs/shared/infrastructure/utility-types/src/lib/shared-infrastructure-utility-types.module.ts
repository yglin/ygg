import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedUiNgMaterialModule} from '@ygg/shared/ui/ng-material';
import {SharedUiWidgetsModule} from '@ygg/shared/ui/widgets';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';

import {ContactComponent, ContactFormComponent} from './contact';
import {DateRangeComponent, DateRangePickerComponent} from './date-range';
import {NumberRangeComponent, NumberRangeControlComponent} from './number-range';
import { TagsComponent } from './tags/tags.component';
import { TagsInputComponent } from './tags/tags-input/tags-input.component';
import { DateRangePickerDialogComponent } from './date-range/date-range-picker/date-range-picker-dialog/date-range-picker-dialog.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule,
    NgxDaterangepickerMd.forRoot(
        {applyLabel: '確定', cancelLabel: '取消', format: 'YYYY/MM/DD'}),
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule
  ],
  declarations: [
    NumberRangeComponent, NumberRangeControlComponent, DateRangeComponent,
    DateRangePickerComponent, ContactComponent, ContactFormComponent, TagsComponent, TagsInputComponent, DateRangePickerDialogComponent
  ],
  entryComponents: [
    DateRangePickerDialogComponent
  ],
  exports: [
    NumberRangeComponent, NumberRangeControlComponent, DateRangeComponent,
    DateRangePickerComponent, ContactComponent, ContactFormComponent, TagsComponent, TagsInputComponent
  ]
})
export class SharedInfrastructureUtilityTypesModule {
}
