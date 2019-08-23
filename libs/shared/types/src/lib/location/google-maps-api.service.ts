/// <reference types="@types/googlemaps" />
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { SiteConfigService } from '@ygg/shared/infra/data-access';

@Injectable({ providedIn: 'root' })
export class GoogleMapsApiService {
  googleMapsApi: any;

  constructor(private siteConfigService: SiteConfigService) {}

  /**
   * This implmenet may change according to google.
   * Right now google stores the downloaded maps api in window['google']['maps']
   */
  getGoogleMapsApiFromWindow(): any {
    if (window && ('google' in window) && ('maps' in window['google'])) {
      return window['google']['maps'];
    } else {
      return null;
    }
  }

  getGoogleMapsApi(): Observable<any> {
    if (this.googleMapsApi || (this.googleMapsApi = this.getGoogleMapsApiFromWindow())) {
      return of(this.googleMapsApi);
    } else {
      return this.siteConfigService.getSiteConfigurations().pipe(
        flatMap(configs => {
          const url = `${configs.google.mapsApi.url}?key=${configs.google.mapsApi.key}&language=${configs.google.mapsApi.language}&callback=initGoogleMapsApi`;

          const doneLoadGoogleMapsApi = new Observable(observer => {
            window['initGoogleMapsApi'] = ev => {
              console.log('Done loading google maps api');
              this.googleMapsApi = this.getGoogleMapsApiFromWindow();
              observer.next(this.googleMapsApi);
              observer.complete();
            };

            console.log('Start loading google maps api...');
            const scriptElement = document.createElement('script');
            scriptElement.type = 'text/javascript';
            scriptElement.src = url;
            document.getElementsByTagName('head')[0].appendChild(scriptElement);
          });

          return doneLoadGoogleMapsApi;
        })
      );
    }
  }
}
