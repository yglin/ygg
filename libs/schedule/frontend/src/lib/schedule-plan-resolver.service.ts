import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { SchedulePlan } from '@ygg/schedule/core';
import { SchedulePlanService } from '@ygg/schedule/data-access';
import { Observable, throwError, of, EMPTY } from 'rxjs';
import { catchError, take, switchMap, tap } from 'rxjs/operators';
import { AuthenticateService, User } from "@ygg/shared/user/ui";
import { Query } from '@ygg/shared/infra/data-access';


@Injectable({
  providedIn: 'root'
})
export class SchedulePlanResolverService implements Resolve<SchedulePlan> {
  constructor(private schedulePlanService: SchedulePlanService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<SchedulePlan> | Observable<never> {
    const id = route.paramMap.get('id');
    if (!id) {
      const error = new Error(`Can not find "id" in URL`);
      alert(error.message);
      return throwError(error);
    }
    // return of(SchedulePlan.forge());
    return this.schedulePlanService.get$(id).pipe(
      take(1),
      catchError(error => {
        alert(error.message);
        console.error(error);
        return throwError(error);
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class MySchedulePlansResolverService implements Resolve<SchedulePlan[]> {
  constructor(
    private schedulePlanService: SchedulePlanService,
    private authenticateService: AuthenticateService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<SchedulePlan[]> | Observable<never> {
    return this.authenticateService.currentUser$.pipe(
      switchMap(user => {
        if (User.isUser(user)) {
          // console.log(`Find schedule-plans of ${user.id}`);
          const query = new Query('creatorId', '==', user.id);
          return this.schedulePlanService.find$(query);
        } else {
          return EMPTY;
        }
      }),
      // tap(plans => console.log(plans)),
      take(1)
    );
  }
}
