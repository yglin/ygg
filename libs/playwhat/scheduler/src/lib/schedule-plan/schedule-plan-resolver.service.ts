import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { SchedulePlan } from './schedule-plan';
import { SchedulePlanService } from './schedule-plan.service';
import { Observable, throwError, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

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
    }));
  }
}
