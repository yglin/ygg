import { includes } from 'lodash';
import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  constructor(private dataAccessService: DataAccessService) {}

  isAdmin(userId: string): Observable<boolean> {
    return this.dataAccessService
      .getDataObject$<Array<string>>('admin/users/roles/admins')
      .pipe(
        map(adminUserIds => {
          return includes(adminUserIds, userId);
        })
      );
  }
}
