import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { TheThingImitation } from '@ygg/the-thing/core';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { first, timeout, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ImitationResolver implements Resolve<TheThingImitation> {
  constructor(private imitationAccessService: TheThingImitationAccessService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const imitationId = route.paramMap.get('imitation');
    return this.imitationAccessService.get$(imitationId).pipe(
      first(),
      timeout(10000),
      catchError(error => {
        alert(`找不到範本 ID:"${imitationId}", 錯誤訊息： ${error.message}`);
        return throwError(error);
      })
    );
  }
}
