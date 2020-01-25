import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SchedulePlanControlComponent,
  SchedulePlanListComponent,
  SchedulePlanTableComponent,
  SchedulePlanThumbnailComponent,
  SchedulePlanViewComponent
} from './schedule-plan';
import { RouterModule } from '@angular/router';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUserModule } from '@ygg/shared/user';
import { SharedTypesModule } from '@ygg/shared/types';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { TagsUiModule } from '@ygg/tags/ui';
import { PlaywhatPlayModule } from '@ygg/playwhat/play';
import { ShoppingUiModule } from '@ygg/shopping/ui';
import { ResourceUiModule } from '@ygg/resource/ui';

@NgModule({
  declarations: [
    SchedulePlanControlComponent,
    SchedulePlanListComponent,
    SchedulePlanTableComponent,
    SchedulePlanThumbnailComponent,
    SchedulePlanViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUserModule,
    SharedTypesModule,
    SharedOmniTypesUiModule,
    TagsUiModule,
    PlaywhatPlayModule,
    ShoppingUiModule,
    ResourceUiModule
  ],
  exports: [
    SchedulePlanControlComponent,
    SchedulePlanListComponent,
    SchedulePlanTableComponent,
    SchedulePlanThumbnailComponent,
    SchedulePlanViewComponent
  ]
})
export class ScheduleUiModule {}
