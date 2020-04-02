import { isEmpty } from "lodash";
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Play } from './play';
import { Observable, throwError } from 'rxjs';
import { AuthenticateService } from "@ygg/shared/user/ui";
import { take, switchMap, tap } from 'rxjs/operators';
import { PlayService } from './play.service';
import { LogService } from '@ygg/shared/infra/log';

@Injectable({
  providedIn: 'root'
})
export class MyPlaysResolver implements Resolve<Play[]> {
  constructor(
    private authenticateService: AuthenticateService,
    private playService: PlayService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Play[]> | Observable<never> {
    return this.authenticateService.currentUser$.pipe(
      switchMap(user => {
        // console.log(user);
        return this.playService.listByCreator$(user);
      }),
      take(1)
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class PlayResolver implements Resolve<Play> {
  constructor(
    private playService: PlayService,
    private logService: LogService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Play> | Observable<never> {
    const id = route.paramMap.get('id');
    if (id) {
      return this.playService.get$(id).pipe(take(1));
    } else {
      const error = new Error(`Can not find play id in route path: ${route}`);
      this.logService.error(error);
      return throwError(error);
    }
  }
}
