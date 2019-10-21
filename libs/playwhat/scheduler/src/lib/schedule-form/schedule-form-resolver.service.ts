import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { ScheduleForm } from './schedule-form';
import { ScheduleFormService } from './schedule-form.service';
import { Observable, throwError, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleFormResolverService implements Resolve<ScheduleForm> {
  constructor(private scheduleFormService: ScheduleFormService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ScheduleForm> | Observable<never> {
    const id = route.paramMap.get('id');
    if (!id) {
      const error = new Error(`Can not find "id" in URL`);
      alert(error.message);
      return throwError(error);
    }
    // return of(ScheduleForm.forge());
    return this.scheduleFormService.get$(id).pipe(
      take(1),
      catchError(error => {
      alert(error.message);
      console.error(error);
      return throwError(error);
    }));
  }
}
