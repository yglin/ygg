import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedDomainResourceModule} from '@ygg/shared/domain/resource';
import {SharedInfrastructureUtilityTypesModule} from '@ygg/shared/infrastructure/utility-types';
import {SharedUiNgMaterialModule} from '@ygg/shared/ui/ng-material';
import {SharedUiWidgetsModule} from '@ygg/shared/ui/widgets';

import {ScheduleFormComponent} from './schedule-form';


@NgModule({
  declarations: [ScheduleFormComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule,
    SharedUiNgMaterialModule, SharedUiWidgetsModule,
    SharedInfrastructureUtilityTypesModule, SharedDomainResourceModule
  ],
  exports: [ScheduleFormComponent]
})
export class SharedDomainScheduleModule {
}
