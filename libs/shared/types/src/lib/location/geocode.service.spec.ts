import { TestBed, inject } from '@angular/core/testing';

import { GeocodeService } from './geocode.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GoogleMapsApiService } from './google-maps-api.service';

@Injectable()
class MockGoogleMapsApiService {
  getGoogleMapsApi(): Observable<any> {
    return of({});
  }
}

describe('GeocodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GeocodeService,
        { provide: GoogleMapsApiService, useClass: MockGoogleMapsApiService }
      ]
    });
  });

  it('should be created', inject(
    [GeocodeService],
    (service: GeocodeService) => {
      expect(service).toBeTruthy();
    }
  ));
});
