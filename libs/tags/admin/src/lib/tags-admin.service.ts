import { Injectable } from '@angular/core';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { TaggableType, Tag } from '@ygg/tags/core';
import { TagsService } from '@ygg/tags/data-access';

@Injectable({
  providedIn: 'root'
})
export class TagsAdminService {

  private _menu: MenuTree;
  set menu(value: MenuTree) {
    if (value) {
      this._menu = value;
    }
  }
  get menu(): MenuTree {
    return this._menu;
  }

  constructor(
    private tagsService: TagsService
  ) {
    this._menu = new MenuTree();
  }

  async saveUserOptionTags(taggableType: TaggableType, userOptionTags: Tag[]) {
    return this.tagsService.setOptionTags$(taggableType, userOptionTags);
  }
}
