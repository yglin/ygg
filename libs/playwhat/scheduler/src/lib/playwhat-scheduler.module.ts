import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SharedTypesModule} from '@ygg/shared/types';
import {SharedUiNgMaterialModule} from '@ygg/shared/ui/ng-material';
import {SharedUiWidgetsModule} from '@ygg/shared/ui/widgets';
import {PlaywhatResourceModule} from '@ygg/playwhat/resource';

import {ScheduleFormComponent} from './schedule-form';
import {ScheduleFormViewComponent} from './schedule-form/schedule-form-view/schedule-form-view.component';


@NgModule({
  declarations: [ScheduleFormComponent, ScheduleFormViewComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule,
    SharedUiNgMaterialModule, SharedUiWidgetsModule,
    SharedTypesModule, PlaywhatResourceModule
  ],
  exports: [ScheduleFormComponent, ScheduleFormViewComponent]
})
export class PlaywhatSchedulerModule {}
