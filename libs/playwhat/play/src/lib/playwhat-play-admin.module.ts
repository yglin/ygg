import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayAdminService } from './admin/Play-admin.service';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';
import { adminMenu } from './admin';
import { AdminPlayTagsComponent } from './admin/admin-play-tags/admin-play-tags.component';

@NgModule({
  declarations: [AdminPlayTagsComponent],
  entryComponents: [AdminPlayTagsComponent],
  imports: [CommonModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configMenuTree,
      deps: [PlayAdminService, PlaywhatAdminService],
      multi: true
    }
  ]
})
export class PlaywhatPlayAdminModule {}

export function configMenuTree(
  playAdminService: PlayAdminService,
  playwhatAdminService: PlaywhatAdminService
): Function {
  return () => {
    playAdminService.menu = adminMenu;
    playwhatAdminService.menu.addMenu(playAdminService.menu);
  };
}
