import { Injectable } from '@angular/core';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { Image } from '@ygg/shared/types';
import { LoggedInGuard, AdminGuard } from '@ygg/shared/user';
import { Observable } from 'rxjs';
import { DataAccessService } from '@ygg/shared/infra/data-access';

@Injectable({
  providedIn: 'root'
})
export class PlaywhatAdminService {
  menu: MenuTree;
  adminPath = 'admin';

  constructor(
    private dataAccessService: DataAccessService
  ) {
    this.menu = new MenuTree({
      id: 'admin-dashborad',
      link: this.adminPath,
      label: '後台管控室',
      icon: new Image(),
      tooltip: '管理一些ㄨＡ伯Ａ設定',
      routeConfig: {
        canActivateChild: [AdminGuard]
      }
    });
  }

  async setData<T>(path: string, data: T) {
    const fullPath = this.adminPath + '/' + path;
    return await this.dataAccessService.setDataObject<T>(fullPath, data);
  }

  getData$<T>(path: string): Observable<T> {
    // console.log(this.menu.getPath('agent'));
    const fullPath = this.adminPath + '/' + path;
    return this.dataAccessService.getDataObject$<T>(fullPath);
  }


}
