import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// import { RouterModule } from '@angular/router';
// import { SchedulerAdminRoutingModule } from "@ygg/playwhat/scheduler";

// import { routes } from './routes';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { Image } from '@ygg/shared/omni-types/core';
import { LoggedInGuard, AdminGuard } from '@ygg/shared/user';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { TheThingUiModule } from '@ygg/the-thing/ui';

import { PlaywhatAdminService } from './playwhat-admin.service';
import { HomepageManageComponent } from './homepage-manage/homepage-manage.component';
import { ImitationTourPlan } from "@ygg/playwhat/core";

@NgModule({
  imports: [
    CommonModule,
    SharedUiWidgetsModule,
    TheThingUiModule
    // SchedulerAdminRoutingModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [HomepageManageComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configRouting,
      deps: [Injector, PlaywhatAdminService],
      multi: true
    }
  ],
  exports: [],
  entryComponents: [HomepageManageComponent]
})
export class PlaywhatAdminModule {}

export function configRouting(
  injector: Injector,
  playwhatAdminService: PlaywhatAdminService
): Function {
  return () => {
    // console.log('Init module PlaywhatAdminModule');
    const router = injector.get(Router);
    playwhatAdminService.menu.addItem({
      id: 'homepage-manage',
      link: 'homepage',
      label: '首頁管理',
      icon: new Image('/assets/images/admin/homepage-manage.png'),
      tooltip: '管理首頁展示的物件',
      routeConfig: {
        component: HomepageManageComponent
      }
    });
    playwhatAdminService.menu.addItem({
      id: 'tour-plans',
      link: 'tour-plans',
      label: '遊程規劃清單',
      icon: new Image(ImitationTourPlan.image),
      tooltip: '遊程規劃清單管理頁面',
      routeConfig: {
        redirectTo: `/the-things/admin/${ImitationTourPlan.id}`
      }
    });
    const adminRoute = playwhatAdminService.menu.toRoute();
    // console.dir(adminRoute);
    router.config.unshift(adminRoute);
    return Promise.resolve();
  };
}
