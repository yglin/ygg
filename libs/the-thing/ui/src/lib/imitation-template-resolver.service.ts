import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { take, catchError, timeout } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ImitationTemplateResolver implements Resolve<TheThing> {
  constructor(
    private route: ActivatedRoute,
    private imitationAccessService: TheThingImitationAccessService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const imitationId = route.paramMap.get('imitation');
    return this.imitationAccessService.getTemplate$(imitationId).pipe(
      take(1),
      timeout(10000),
      catchError(error => {
        alert(`找不到 "${imitationId}" 的範本, 錯誤訊息： ${error.message}`);
        this.router.navigate(['/the-things/create']);
        return of(null);
      })
    );
  }
}
