import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';
import { Observable, of } from 'rxjs';
import { UserService, User } from '@ygg/shared/user';
import { switchMap } from 'rxjs/operators';
// import { adminMenu } from './menu';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';
import { Image } from '@ygg/shared/types';

@Injectable({
  providedIn: 'root'
})
export class SchedulerAdminService {
  menu: MenuTree;

  constructor(
    private playwhatAdminService: PlaywhatAdminService
  ) {
    this.menu = new MenuTree({
      id: 'scheduler',
      icon: new Image('/assets/images/admin/accounting.png'),
      label: '遊程相關',
      tooltip: '遊程規劃相關設定',
      link: 'scheduler'
    });    
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

}
