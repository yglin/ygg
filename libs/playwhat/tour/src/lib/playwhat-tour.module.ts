import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { TourViewComponent } from './ui/tour-view/tour-view.component';
import { TheThingUiModule } from '@ygg/the-thing/ui';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { SharedTypesModule } from '@ygg/shared/types';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { PlayCardComponent } from './ui/play-card/play-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TourPlanViewComponent } from './ui/tour-plan-view/tour-plan-view.component';
import { TheThingConfig } from './the-thing-config';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

export const playwhatTourRoutes: Route[] = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    SharedTypesModule,
    SharedOmniTypesUiModule,
    TheThingUiModule
  ],
  declarations: [TourViewComponent, PlayCardComponent, TourPlanViewComponent],
  entryComponents: [TourViewComponent, TourPlanViewComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configTheThingImitation,
      deps: [TheThingImitationAccessService],
      multi: true
    }
  ],
  exports: [TourViewComponent]
})
export class PlaywhatTourModule {}

export function configTheThingImitation(imitationService: TheThingImitationAccessService) {
  return () => {
    imitationService.add(TheThingConfig.imitations);
  };
}
