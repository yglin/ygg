import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Accommodation } from '@ygg/resource/core';
import { Observable, throwError } from 'rxjs';
import { AccommodationService } from '@ygg/resource/data-access';
import { take, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccommodationResolver implements Resolve<Accommodation> {
  constructor(private accommodationService: AccommodationService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Accommodation> | Observable<never> {
    const id = route.paramMap.get('id');
    if (!id) {
      const error = new Error(`Can not find "id" in URL`);
      alert(error.message);
      return throwError(error);
    }
    // return of(SchedulePlan.forge());
    return this.accommodationService.get$(id).pipe(take(1));
  }
}
