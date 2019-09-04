import 'hammerjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMapComponent } from './google-map.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { Injectable } from '@angular/core';
import { GoogleMapsApiService } from '../../google-maps-api.service';
import { of } from 'rxjs';
import { GeolocationService } from '../geolocation.service';
import { GeoPoint } from '../geo-point';

describe('GoogleMapComponent', () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;

  @Injectable()
  class MockGoogleMapsApiService {
    async getGoogleMapsApi(callback: (any) => any ) {
      if(callback) {
        callback(null);
      }
    }
  }

  @Injectable()
  class MockGeolocationService {
    getCurrentPosition() {
      return of(GeoPoint.forge());
    }
    isSupport() {
      return true;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule],
      declarations: [ GoogleMapComponent ],
      providers: [
        { provide: GeolocationService, useClass: MockGeolocationService },
        { provide: GoogleMapsApiService, useClass: MockGoogleMapsApiService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
