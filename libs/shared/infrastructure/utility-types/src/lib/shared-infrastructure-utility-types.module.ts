import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedUiNgMaterialModule} from '@ygg/shared/ui/ng-material';

import {NumberRangeControlComponent} from './number-range/number-range-control/number-range-control.component';
import {NumberRangeComponent} from './number-range/number-range.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule,
    SharedUiNgMaterialModule
  ],
  declarations: [NumberRangeComponent, NumberRangeControlComponent],
  exports: [NumberRangeControlComponent]
})
export class SharedInfrastructureUtilityTypesModule {
}
