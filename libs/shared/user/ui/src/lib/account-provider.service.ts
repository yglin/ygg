import { isEmpty } from 'lodash';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountProviderService {

  constructor() { }

  getProviderIcon(profile: any): string {
    let providerId = '';
    if (profile && !isEmpty(profile.providerData) && profile.providerData[0] && profile.providerData[0].providerId) {
      providerId = profile.providerData[0].providerId;
    }
    switch (providerId) {
      case 'google.com':
        return 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Google-plus-circle-icon-png.png';
      case 'facebook.com':
        return 'https://upload.wikimedia.org/wikipedia/commons/8/82/Facebook_icon.jpg';
      default:
        return '';
    }
  }
}
