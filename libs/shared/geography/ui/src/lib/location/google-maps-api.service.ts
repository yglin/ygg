/// <reference types="@types/googlemaps" />
import { Injectable, NgZone } from '@angular/core';
import { getEnv } from '@ygg/shared/infra/core';
// @ts-ignore
import { LogService } from '@ygg/shared/infra/log';

class GoogleMapsApiSiteConfig {
  url: string;
  key: string;
  language: string;

  static isGoogleMapsApiSiteConfig(value: any): value is GoogleMapsApiService {
    return !!(value && value.url && value.key && value.language);
  }
}

@Injectable({ providedIn: 'root' })
export class GoogleMapsApiService {
  googleEnv = getEnv('google');
  private googleMapsApi$: Promise<any>;

  constructor(
    // private siteConfigService: SiteConfigService,
    private ngZone: NgZone,
    private logService: LogService
  ) {
    this.googleMapsApi$ = new Promise(async (resolve, reject) => {
      const googleMapsApi = this.getGoogleMapsApiFromWindow();
      if (googleMapsApi) {
        resolve(googleMapsApi);
      } else {
        window['initGoogleMapsApi'] = () => {
          this.logService.info('Done loading google maps api');
          const _googleMapsApi = this.getGoogleMapsApiFromWindow();
          if (_googleMapsApi) {
            resolve(_googleMapsApi);
          } else {
            const error = new Error(
              'Loaded google maps api is null, unknown reason'
            );
            this.logService.error(error.message);
            reject(error);
          }
        };

        try {
          // const siteConfigs = await this.siteConfigService
          //   .getSiteConfigurations()
          //   .pipe(take(1))
          //   .toPromise();

          if (
            !GoogleMapsApiSiteConfig.isGoogleMapsApiSiteConfig(
              this.googleEnv.mapsApi
            )
          ) {
            const error = new Error(
              `Incorrect config for GoogleMapsApi:\n ${JSON.stringify(
                this.googleEnv
              )}`
            );
            throw error;
          }

          const url = `${this.googleEnv.mapsApi.url}?key=${this.googleEnv.mapsApi.key}&language=${this.googleEnv.mapsApi.language}&callback=initGoogleMapsApi`;
          this.logService.info('Start loading google maps api...');
          const scriptElement = document.createElement('script');
          scriptElement.type = 'text/javascript';
          scriptElement.src = url;
          document.getElementsByTagName('head')[0].appendChild(scriptElement);
        } catch (error) {
          this.logService.error(error.message);
          reject(error);
        }
      }
    });
  }

  /**
   * This implmenet may change according to google.
   * Right now google stores the downloaded maps api in window['google']['maps']
   */
  private getGoogleMapsApiFromWindow(): any {
    if (window && 'google' in window && 'maps' in window['google']) {
      return window['google']['maps'];
    } else {
      return null;
    }
  }

  public async getGoogleMapsApi(callback?: (any) => any) {
    return await this.googleMapsApi$.then(
      api => {
        if (callback) {
          this.ngZone.run(() => callback(api));
        }
        return Promise.resolve(api);
      },
      error => Promise.reject(error)
    );
  }

  // private getGoogleMapsApi(): Observable<any> {
  //   let googleMapsApi = this.getGoogleMapsApiFromWindow();
  //   if (googleMapsApi) {
  //     return of(googleMapsApi);
  //   } else {
  //     return this.siteConfigService.getSiteConfigurations().pipe(
  //       flatMap(configs => {
  //         const url = `${configs.google.mapsApi.url}?key=${configs.google.mapsApi.key}&language=${configs.google.mapsApi.language}&callback=initGoogleMapsApi`;

  //         const doneLoadGoogleMapsApi = new Observable(observer => {
  //           window['initGoogleMapsApi'] = ev => {
  //             console.log('Done loading google maps api');
  //             googleMapsApi = this.getGoogleMapsApiFromWindow();
  //             observer.next(googleMapsApi);
  //             observer.complete();
  //           };

  //           console.log('Start loading google maps api...');
  //           const scriptElement = document.createElement('script');
  //           scriptElement.type = 'text/javascript';
  //           scriptElement.src = url;
  //           document.getElementsByTagName('head')[0].appendChild(scriptElement);
  //         });

  //         return doneLoadGoogleMapsApi;
  //       })
  //     );
  //   }
  // }
}
