import { includes } from 'lodash';
import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { map, startWith, switchMap, catchError } from 'rxjs/operators';
import { Observable, of, combineLatest } from 'rxjs';
import { AuthenticateService } from './authenticate.service';
import { LogService } from '@ygg/shared/infra/log';
import { Property } from '@ygg/shared/user/core';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  constructor(
    private dataAccessService: DataAccessService,
    private authenticateService: AuthenticateService,
    private logService: LogService
  ) {}

  getAdminUsers$(): Observable<string[]> {
    return this.dataAccessService
      .getDataObject$<Array<string>>('admin/users/roles/admins')
      .pipe(
        catchError(error => {
          this.logService.error(error.message);
          return of([]);
        })
      );
  }

  isAdmin$(userId?: string): Observable<boolean> {
    let userId$: Observable<string>;
    if (userId) {
      userId$ = of(userId);
    } else {
      userId$ = this.authenticateService.currentUser$.pipe(
        map(user => (!!user ? user.id : null))
      );
    }
    return combineLatest([userId$, this.getAdminUsers$()]).pipe(
      map(([_userId, adminUserIds]) => {
        if (!!_userId && includes(adminUserIds, _userId)) {
          return true;
        }
        return false;
      })
    );
    // if (!userId && this.authenticateService.currentUser) {
    //   userId = this.authenticateService.currentUser.id;
    // }
    // if (!userId) {
    //   this.logService.warning(
    //     `No given user or current user, AuthorizeService.isAdmin$() failed.`
    //   );
    //   return of(false);
    // } else {
    //   return this.dataAccessService
    //     .getDataObject$<Array<string>>('admin/users/roles/admins')
    //     .pipe(
    //       map(adminUserIds => {
    //         return includes(adminUserIds, userId);
    //       })
    //     );
    // }
  }

  isOwner$(property: Property): Observable<boolean> {
    return this.authenticateService.currentUser$.pipe(
      startWith(this.isOwner(property)),
      map(() => this.isOwner(property))
    );
  }

  isOwner(property: Property): boolean {
    return (
      this.authenticateService.currentUser &&
      this.authenticateService.currentUser.id === property.ownerId
    );
  }

  canModify$(property: Property): Observable<boolean> {
    return this.authenticateService.currentUser$.pipe(
      startWith(this.canModify(property)),
      map(() => this.canModify(property))
    );
  }

  canModify(property: Property): boolean {
    // console.log(property.ownerId);
    return !property.ownerId || this.isOwner(property);
  }
}
