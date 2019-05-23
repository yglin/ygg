import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedUiNgMaterialModule} from '@ygg/shared/ui/ng-material';

import {ActionBarredComponent} from './action-barred/action-barred.component';
import {YggDialogComponent, YggDialogContentHostDirective} from './dialog/ygg-dialog.component';
import {IMaybeALinkDirective} from './i-maybe-a-link/i-maybe-a-link.directive';
import {NumberSliderComponent} from './number-slider/number-slider.component';
import {PageTitleComponent} from './page-title/page-title.component';
import {ProgressSpinnerComponent} from './progress-spinner/progress-spinner.component';
import {TimeRangeComponent} from './time-range/time-range.component';
import {TitleDividerComponent} from './title-divider/title-divider.component';


@NgModule({
  declarations: [
    ProgressSpinnerComponent, PageTitleComponent, IMaybeALinkDirective,
    NumberSliderComponent, TimeRangeComponent, TitleDividerComponent,
    ActionBarredComponent, YggDialogComponent, YggDialogContentHostDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    FlexLayoutModule,
  ],
  exports: [
    SharedUiNgMaterialModule, FlexLayoutModule, PageTitleComponent,
    IMaybeALinkDirective, NumberSliderComponent, TimeRangeComponent,
    TitleDividerComponent, ActionBarredComponent
  ],
  entryComponents: [ProgressSpinnerComponent, YggDialogComponent]
})
export class SharedUiWidgetsModule {
}
