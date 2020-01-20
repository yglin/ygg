import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { TourViewComponent } from './ui/tour-view/tour-view.component';
import { TheThingUiModule, ImitationService } from '@ygg/the-thing/ui';
import { SharedTypesModule } from '@ygg/shared/types';
import { SharedOmniTypesUiModule } from "@ygg/shared/omni-types/ui";
import { PlayCardComponent } from './ui/play-card/play-card.component';

export const playwhatTourRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, RouterModule, SharedTypesModule, SharedOmniTypesUiModule, TheThingUiModule],
  declarations: [TourViewComponent, PlayCardComponent],
  entryComponents: [TourViewComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configTheThingImitation,
      deps: [ImitationService],
      multi: true
    }
  ],
  exports: [TourViewComponent]
})
export class PlaywhatTourModule {}

function configTheThingImitation(imitationService: ImitationService) {
  return () => {
    imitationService.add({
      id: 'tour',
      name: '遊程(體驗組合)',
      view: {
        component: TourViewComponent
      }
    });
  };
}
