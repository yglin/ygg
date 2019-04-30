import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SharedUiNgMaterialModule} from '@ygg/shared/ui/ng-material';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';

import {DateRangePickerComponent} from './date-range-picker/date-range-picker.component';
import {IMaybeALinkDirective} from './i-maybe-a-link/i-maybe-a-link.directive';
import {PageTitleComponent} from './page-title/page-title.component';
import {ProgressSpinnerComponent} from './progress-spinner/progress-spinner.component';
import { NumberSliderComponent } from './number-slider/number-slider.component';
import { TimeRangeComponent } from './time-range/time-range.component';


@NgModule({
  declarations: [
    ProgressSpinnerComponent, PageTitleComponent, IMaybeALinkDirective,
    DateRangePickerComponent,
    NumberSliderComponent,
    TimeRangeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    FlexLayoutModule,
    NgxDaterangepickerMd.forRoot(
        {applyLabel: '確定', cancelLabel: '取消', format: 'YYYY/MM/DD'}),
  ],
  exports: [
    SharedUiNgMaterialModule, FlexLayoutModule, PageTitleComponent,
    IMaybeALinkDirective, DateRangePickerComponent, NumberSliderComponent, TimeRangeComponent
  ],
  entryComponents: [ProgressSpinnerComponent]
})
export class SharedUiWidgetsModule {
}
