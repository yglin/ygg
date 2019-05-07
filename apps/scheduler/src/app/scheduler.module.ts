import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedInfrastructureUtilityTypesModule } from '@ygg/shared/infrastructure/utility-types';
import { SharedDomainScheduleModule } from '@ygg/shared/domain/schedule';

import { SchedulerComponent } from './scheduler/scheduler.component';
import { ScheduleViewComponent } from './schedule-view/schedule-view.component';
import { SchedulerAutoComponent } from './scheduler-auto/scheduler-auto.component';
import { SchedulerManualComponent } from './scheduler-manual/scheduler-manual.component';
import { ResourceFrontendFeatureModule } from '@ygg/apps/resource/frontend';

import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { EventListComponent } from './event-list/event-list.component';
import { EventThumbnailComponent } from './event-thumbnail/event-thumbnail.component';

@NgModule({
  declarations: [SchedulerComponent, ScheduleViewComponent, SchedulerAutoComponent, SchedulerManualComponent, EventListComponent, EventThumbnailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedInfrastructureUtilityTypesModule,
    SharedUiWidgetsModule,
    ResourceFrontendFeatureModule,
    SharedDomainScheduleModule
  ]
})
export class SchedulerModule { }

@NgModule({
  imports: [
    SchedulerModule,
    RouterModule.forChild(routes)
  ]
})
export class SchedulerFeatureModule { }
