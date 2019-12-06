import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

import { ActionBarredComponent } from './action-barred/action-barred.component';
import {
  YggDialogComponent,
  YggDialogContentHostDirective
} from './dialog/ygg-dialog.component';
import { IMaybeALinkDirective } from './i-maybe-a-link/i-maybe-a-link.directive';
import { NumberSliderComponent } from './number-slider/number-slider.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { TitleDividerComponent } from './title-divider/title-divider.component';
import { ReactiveTextInputComponent } from './reactive-text-input/reactive-text-input.component';
import { ItemsGroupSwitcherComponent } from './items-group-switcher/items-group-switcher.component';
import { TimeInputComponent } from './time-input/time-input.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { ChipsControlComponent } from './chips-control/chips-control.component';
import { ImageIconComponent } from './image-icon/image-icon.component';
import { ActionBarLayoutComponent } from './action-bar-layout/action-bar-layout.component';
import { PriceComponent } from './price/price.component';

@NgModule({
  declarations: [
    ProgressSpinnerComponent,
    PageTitleComponent,
    IMaybeALinkDirective,
    NumberSliderComponent,
    TitleDividerComponent,
    ActionBarredComponent,
    YggDialogComponent,
    YggDialogContentHostDirective,
    ReactiveTextInputComponent,
    ItemsGroupSwitcherComponent,
    TimeInputComponent,
    ChipsControlComponent,
    ImageIconComponent,
    ActionBarLayoutComponent,
    PriceComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    FlexLayoutModule,
    AmazingTimePickerModule
  ],
  exports: [
    SharedUiNgMaterialModule,
    FlexLayoutModule,
    PageTitleComponent,
    IMaybeALinkDirective,
    NumberSliderComponent,
    TitleDividerComponent,
    ActionBarredComponent,
    ReactiveTextInputComponent,
    ItemsGroupSwitcherComponent,
    TimeInputComponent,
    ChipsControlComponent,
    ImageIconComponent,
    ActionBarLayoutComponent,
    PriceComponent
  ],
  entryComponents: [ProgressSpinnerComponent, YggDialogComponent]
})
export class SharedUiWidgetsModule {}
