import { Injectable } from '@angular/core';
import { MenuTree } from '@ygg/shared/ui/navigation';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsAdminService {
  adminPath = 'admin/tags';

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
    private dataAccessService: DataAccessService
  ) {
    this._menu = new MenuTree();
  }

  async setData(path: string, data: any) {
    const fullPath = this.adminPath + '/' + path;
    return await this.dataAccessService.setDataObject<any>(fullPath, data);
  }

  getData$(path: string): Observable<any> {
    // console.log(this.menu.getPath('agent'));
    const fullPath = this.adminPath + '/' + path;
    return this.dataAccessService.getDataObject$<any>(fullPath);
  }
}
