import { Injectable } from '@angular/core';
import { Observable, of, timer, throwError, from } from 'rxjs';
import {
  timeout,
  throttleTime,
  shareReplay,
  catchError,
  switchMap,
  take
} from 'rxjs/operators';
import { GeoPoint } from '@ygg/shared/geography/core';
import { LogService } from '@ygg/shared/infra/log';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  myPosition$: Observable<GeoPoint>;

  constructor(private logService: LogService) {}

  isSupport(): boolean {
    return !!(
      navigator &&
      navigator.geolocation &&
      typeof navigator.geolocation.getCurrentPosition === 'function'
    );
  }

  getCurrentPosition(): Observable<GeoPoint> {
    if (!this.myPosition$) {
      this.myPosition$ = timer(0, 1000).pipe(
        switchMap(() => from(this.fromNavigatorGeolocation())),
        shareReplay(1)
      );
    }
    return this.myPosition$.pipe(take(1));
  }

  async fromNavigatorGeolocation(): Promise<GeoPoint> {
    if (!this.isSupport()) {
      const error = new Error('抱歉，您的瀏覽器不支援定位功能');
      this.logService.error(error.message);
      alert(error.message);
      return Promise.reject(error);
    } else {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => {
            resolve(
              GeoPoint.fromLatLng(
                position.coords.latitude,
                position.coords.longitude
              )
            );
          },
          error => {
            this.logService.error(error);
            reject(error);
          }
        );
      });
    }
  }
}
