import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsAdminUserOptionsComponent } from './tags-admin-user-options/tags-admin-user-options.component';
import { TagsAdminService } from './tags-admin.service';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';
import { adminMenu } from './admin-menu';
import { TagsAdminListComponent } from './tags-admin-list/tags-admin-list.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';

@NgModule({
  declarations: [TagsAdminUserOptionsComponent, TagsAdminListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule
  ],
  entryComponents: [TagsAdminListComponent, TagsAdminUserOptionsComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configMenuTree,
      deps: [TagsAdminService, PlaywhatAdminService],
      multi: true
    }
  ]
})
export class TagsAdminModule {}

export function configMenuTree(
  tagsAdminService: TagsAdminService,
  playwhatAdminService: PlaywhatAdminService
): Function {
  return () => {
    tagsAdminService.menu = adminMenu;
    playwhatAdminService.menu.addMenu(tagsAdminService.menu);
  };
}
