import { includes } from 'lodash';
import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthenticateService } from './authenticate.service';
import { LogService } from '@ygg/shared/infra/log';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  constructor(
    private dataAccessService: DataAccessService,
    private authenticateService: AuthenticateService,
    private logService: LogService
  ) {}

  isAdmin(userId?: string): Observable<boolean> {
    if (!userId && this.authenticateService.currentUser) {
      userId = this.authenticateService.currentUser.id;
    }
    if (!userId) {
      this.logService.warning(
        `No given user or current user, AuthorizeService.isAdmin() failed.`
      );
      return of(false);
    } else {
      return this.dataAccessService
      .getDataObject$<Array<string>>('admin/users/roles/admins')
      .pipe(
        map(adminUserIds => {
          return includes(adminUserIds, userId);
        })
      );
    }
  }
}
