import { Injectable } from '@angular/core';
// import { isEmpty } from 'lodash';
import { Observable, of } from 'rxjs';
// import { UserService, User } from '@ygg/shared/user';
import { switchMap, map } from 'rxjs/operators';
// import { adminMenu } from './menu';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';
import { Image, Tags } from '@ygg/shared/types';

@Injectable({
  providedIn: 'root'
})
export class PlayAdminService {
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
    private playwhatAdminService: PlaywhatAdminService
  ) {
    this._menu = new MenuTree();
  }

  async setData<T>(id: string, data: T) {
    try {
      await this.playwhatAdminService.setData<T>(this.menu.getPath(id), data);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  getData$<T>(id: string): Observable<T> {
    // console.log(this.menu.getPath('agent'));
    const path = this.menu.getPath(id);
    return this.playwhatAdminService.getData$<T>(path);
  }

  getTags$(): Observable<Tags> {
    return this.getData$<string[]>('tags').pipe(map(tagNames => new Tags(tagNames)));
  }

  async setTags(tags: Tags) {
    await this.setData<string[]>('tags', tags.values);
  }

}
