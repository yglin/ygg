/// <reference types="@types/googlemaps" />
import { random, range } from 'lodash';
import { Injectable } from '@angular/core';
import { Address } from '@ygg/shared/geography/core';
import { Observable, of, AsyncSubject, from } from 'rxjs';
import { delay, switchMap, timeout, catchError, map } from 'rxjs/operators';
import { GoogleMapsApiService } from './google-maps-api.service';
import { GeoPoint } from '@ygg/shared/geography/core';

@Injectable({ providedIn: 'root' })
export class GeocodeService {
  constructor(private googleMapsApiService: GoogleMapsApiService) {}

  geoPointToAddress(geoPoint: GeoPoint): Observable<Address> {
    return from(this.googleMapsApiService.getGoogleMapsApi()).pipe(
      switchMap(() => {
        const doneGeocoding = new AsyncSubject<google.maps.GeocoderResult[]>();
        const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          {
            location: geoPoint.toGoogleMapsLatLng()
          },
          (results, status) => {
            if (status.toString() === 'OK') {
              doneGeocoding.next(results);
            } else {
              doneGeocoding.error(status);
            }
            doneGeocoding.complete();
          }
        );
        return doneGeocoding;
      }),
      timeout(2000),
      map(geocodeResult => {
        return Address.fromRaw(geocodeResult[0].formatted_address);
      }),
      catchError(error => {
        alert(`解析地址失敗，錯誤原因：${error}`);
        return of(null);
      })
    );
  }

  addressToGeoPoints(address: Address): Observable<GeoPoint[]> {
    return from(this.googleMapsApiService.getGoogleMapsApi()).pipe(
      switchMap(() => {
        const doneGeocoding = new AsyncSubject<google.maps.GeocoderResult[]>();
        const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          {
            address: address.getFullAddress()
          },
          (results, status) => {
            if (status.toString() === 'OK') {
              doneGeocoding.next(results);
            } else {
              doneGeocoding.error(status);
            }
            doneGeocoding.complete();
          }
        );
        return doneGeocoding;
      }),
      timeout(2000),
      map(geocodeResults => {
        return geocodeResults.map(result => {
          return GeoPoint.fromGoogleMapsLatLng(result.geometry.location);
        });
      }),
      catchError(error => {
        alert(`解析座標失敗，錯誤原因：${error}`);
        return of([]);
      })
    );
  }
}
