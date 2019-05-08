import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedUiNgMaterialModule} from '@ygg/shared/ui/ng-material';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';

import {ContactComponent, ContactFormComponent} from './contact';
import {DateRangeComponent, DateRangePickerComponent} from './date-range';
import {NumberRangeComponent, NumberRangeControlComponent} from './number-range';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule,
    NgxDaterangepickerMd.forRoot(
        {applyLabel: '確定', cancelLabel: '取消', format: 'YYYY/MM/DD'}),
    SharedUiNgMaterialModule
  ],
  declarations: [
    NumberRangeComponent, NumberRangeControlComponent, DateRangeComponent,
    DateRangePickerComponent, ContactComponent, ContactFormComponent
  ],
  exports: [
    NumberRangeComponent, NumberRangeControlComponent, DateRangeComponent,
    DateRangePickerComponent, ContactComponent, ContactFormComponent
  ]
})
export class SharedInfrastructureUtilityTypesModule {
}
