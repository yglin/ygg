import { Injectable } from '@angular/core';
import { getEnv } from "@ygg/shared/infra/core";

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  googleEnv = getEnv('google');
  constructor() {}

  async loadGoogleApiClient(): Promise<any> {
    const gapi = await this.loadGoogleApi();
    if ('client' in gapi) {
      return gapi['client'];
    }

    return new Promise((resolve, reject) => {
      // const afterSignedIn = (signedIn: boolean) => {
      //   console.log('Done loading google api client');
      //   resolve(gapi['client']);
      // };
      try {
        gapi.load('client:auth2', () => {
          gapi.client
            .init({
              apiKey: this.googleEnv.api.key,
              clientId: this.googleEnv.api.clientId,
              discoveryDocs: this.googleEnv.api.discoveryDocs,
              scope: this.googleEnv.api.scope
            })
            .then(
              () => {
                // Listen for sign-in state changes.
                // gapi.auth2.getAuthInstance().isSignedIn.listen(afterSignedIn);
                console.log('Sign in google account');
                gapi.auth2.getAuthInstance().signIn().then(
                  () => {
                    resolve(gapi['client']);
                  },
                  error => reject(error)
                );
              },
              _error => {
                throw _error;
              }
            );
        });
      } catch (error) {
        const wrapError = new Error(
          `Failed to load google api client, ${error.message}`
        );
        console.log(wrapError.message);
        reject(wrapError);
      }
    });
  }

  async loadGoogleApi(): Promise<any> {
    if (window && 'gapi' in window) {
      console.log('Google api already loaded');
      return window['gapi'];
    }

    return new Promise((resolve, reject) => {
      try {
        window['onLoadGoogleApi'] = () => {
          console.log(`Done loading google api from ${this.googleEnv.api.url}`);
          resolve(window['gapi']);
        };
        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = this.googleEnv.api.url;
        scriptElement.setAttribute('onload', 'onLoadGoogleApi()');
        scriptElement.setAttribute(
          'onreadystatechange',
          "if (this.readyState === 'complete') this.onload()"
        );
        console.log(`Start loading google api from ${this.googleEnv.api.url}`);
        document.getElementsByTagName('head')[0].appendChild(scriptElement);
      } catch (error) {
        console.error(`Failed to load ${this.googleEnv.api.url}, ${error.message}`);
        reject(error);
      }
    });
  }
}
