/// <reference types="@types/googlemaps" />
import { random, range } from 'lodash';
import { Injectable } from '@angular/core';
import { GeoPoint } from './geo-point';
import { Address } from './address';
import { Observable, of, AsyncSubject } from 'rxjs';
import { delay, switchMap, timeout, catchError, map } from 'rxjs/operators';
import { GoogleMapsApiService } from './google-maps-api.service';

@Injectable({ providedIn: 'root' })
export class GeocodeService {
  constructor(private googleMapsApiService: GoogleMapsApiService) {}

  geoPointToAddress(geoPoint: GeoPoint): Observable<Address> {
    return this.googleMapsApiService.getGoogleMapsApi().pipe(
      switchMap(googleMapsApi => {
        const doneGeocoding = new AsyncSubject<google.maps.GeocoderResult[]>();
        const geocoder: google.maps.Geocoder = new googleMapsApi.Geocoder();
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
    return this.googleMapsApiService.getGoogleMapsApi().pipe(
      switchMap(googleMapsApi => {
        const doneGeocoding = new AsyncSubject<google.maps.GeocoderResult[]>();
        const geocoder: google.maps.Geocoder = new googleMapsApi.Geocoder();
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
