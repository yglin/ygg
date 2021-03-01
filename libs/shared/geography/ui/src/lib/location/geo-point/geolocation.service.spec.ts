import { random, range } from "lodash";
import { TestBed, inject } from '@angular/core/testing';


import { GeolocationService } from './geolocation.service';
import { GeoPoint } from './geo-point';

class MockPosition {
  coords: { latitude: number, longitude: number };

  static forge(): MockPosition {
    const newOne = new MockPosition();
    newOne.coords = {
      latitude: random(22, 24, true),
      longitude: random(120, 122, true)
    };
    return newOne;
  }

  toGeoPoint(): GeoPoint {
    return GeoPoint.fromLatLng(this.coords.latitude, this.coords.longitude);
  }
}

class MockGeolocation {
  mockedPosition =  MockPosition.forge();

  getCurrentPosition(success) {
    return Promise.resolve(success(this.mockedPosition));
  }
}

jest.useFakeTimers();

describe('GeolocationService', () => {
  let service: GeolocationService;
  let mockGeolocation: MockGeolocation;

  beforeAll(() => {
    mockGeolocation = new MockGeolocation();
    Object.defineProperty(global, 'navigator', { value: { geolocation: mockGeolocation} });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeolocationService]
    });
  });

  beforeEach(() => {
    service = TestBed.get(GeolocationService);
    jest.spyOn(window, 'alert').mockImplementation(console.error);
  });
  
  it('should get my current position from HTML5 navigator.geolocation.getCurrentPosition', async done => {
    jest.spyOn(navigator.geolocation, 'getCurrentPosition');
    service.getCurrentPosition().subscribe(myPosition => {
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
      expect(myPosition.toJSON()).toEqual(mockGeolocation.mockedPosition.toGeoPoint().toJSON());
      done();
    });
    jest.advanceTimersByTime(1);
  });

  it('should throttle calls to navigator.geolocation.getCurrentPosition every 1 second', async done => {
    jest.spyOn(service, 'fromNavigatorGeolocation');
    service.getCurrentPosition().subscribe(() => {});
    service.getCurrentPosition().subscribe(() => {});
    service.getCurrentPosition().subscribe(() => {});
    jest.advanceTimersByTime(1);
    // Above subscriptions only call navigator.geolocation.getCurrentPosition once();
    expect(service.fromNavigatorGeolocation).toHaveBeenCalledTimes(1);

    // Wait after 1s then subscribe,
    // now should call navigator.geolocation.getCurrentPosition again
    setTimeout(() => {
      service.getCurrentPosition().subscribe();
      expect(service.fromNavigatorGeolocation).toHaveBeenCalledTimes(2);
      done();
    }, 1001);
    jest.advanceTimersByTime(1002);
  });
  
});
