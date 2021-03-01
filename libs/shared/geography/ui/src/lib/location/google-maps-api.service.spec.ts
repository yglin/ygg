import { TestBed, inject } from '@angular/core/testing';

import { GoogleMapsApiService } from './google-maps-api.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SiteConfigService } from '@ygg/shared/infra/data-access';

@Injectable()
class MockSiteConfigService {
  getSiteConfigurations(): Observable<any> {
    return of({
      google: {
        mapsApi: {
          url: 'http://fake-google-maps-api',
          key: 'fake-key',
          language: 'zh-TW'
        }
      }
    });
  }
}

describe('GoogleMapsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GoogleMapsApiService,
        { provide: SiteConfigService, useClass: MockSiteConfigService }
      ]
    });
  });

  it('should be created', inject(
    [GoogleMapsApiService],
    (service: GoogleMapsApiService) => {
      expect(service).toBeTruthy();
    }
  ));
});
