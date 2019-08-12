import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// import { RouterModule } from '@angular/router';
// import { SchedulerAdminRoutingModule } from "@ygg/playwhat/scheduler";

// import { routes } from './routes';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { Image } from "@ygg/shared/types";
import { LoggedInGuard, AdminGuard } from '@ygg/shared/user';
import { PlaywhatAdminService } from './playwhat-admin.service';

@NgModule({
  imports: [
    CommonModule,
    // SchedulerAdminRoutingModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [],
  providers: [
    {provide: APP_INITIALIZER, useFactory: configRouting, deps: [Injector, PlaywhatAdminService], multi: true}
  ],
  exports: []
})
export class PlaywhatAdminModule {}

export function configRouting(injector: Injector, playwhatAdminService: PlaywhatAdminService): Function {
    return () => {
    // console.log('Init module PlaywhatAdminModule');
    const router = injector.get(Router);
    const adminRoute = playwhatAdminService.menu.toRoute();
    // console.dir(adminRoute);
    router.config.unshift(adminRoute);
    return Promise.resolve();
  };
}
