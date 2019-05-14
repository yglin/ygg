import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedDomainResourceModule} from '@ygg/shared/domain/resource';
import {SharedDomainScheduleModule} from '@ygg/shared/domain/schedule';
import {SharedInfrastructureUtilityTypesModule} from '@ygg/shared/infrastructure/utility-types';
import {SharedUiNgMaterialModule} from '@ygg/shared/ui/ng-material';
import {SharedUiWidgetsModule} from '@ygg/shared/ui/widgets';

import {EventListComponent} from './event-list/event-list.component';
import {EventThumbnailComponent} from './event-thumbnail/event-thumbnail.component';
import {routes} from './routes';
// import { ScheduleViewComponent } from
// './schedule-view/schedule-view.component';
import {SchedulerAutoComponent} from './scheduler-auto/scheduler-auto.component';
import {SchedulerFormPageComponent} from './scheduler-form-page/scheduler-form-page.component';
import {SchedulerFormViewPageComponent} from './scheduler-form-view-page/scheduler-form-view-page.component';
import {SchedulerManualComponent} from './scheduler-manual/scheduler-manual.component';
import {SchedulerComponent} from './scheduler/scheduler.component';

@NgModule({
  declarations: [
    SchedulerComponent, SchedulerAutoComponent,
    SchedulerManualComponent, EventListComponent, EventThumbnailComponent,
    SchedulerFormPageComponent, SchedulerFormViewPageComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule,
    SharedInfrastructureUtilityTypesModule, SharedUiWidgetsModule,
    SharedDomainResourceModule, SharedDomainScheduleModule
  ]
})
export class SchedulerModule {
}

@NgModule({imports: [SchedulerModule, RouterModule.forChild(routes)]})
export class SchedulerFeatureModule {
}
