import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { PlaywhatPlayModule } from './playwhat-play.module';

import { routesForLazyLoad } from './routes';
import { UserMenuService } from '@ygg/shared/user';
export const routes: Route[] = [{ path: 'plays', children: routesForLazyLoad }];

@NgModule({
  declarations: [],
  imports: [CommonModule, PlaywhatPlayModule, RouterModule.forChild(routes)],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configUserMenu,
      deps: [UserMenuService],
      multi: true
    }
  ]
})
export class PlaywhatPlayFrontendModule {}

export function configUserMenu(userMenuService: UserMenuService) {
  return () => {
    userMenuService.addItem({
      id: 'play',
      label: '我的體驗',
      link: 'plays/my',
      icon: 'local_play'
    });
  };
}
