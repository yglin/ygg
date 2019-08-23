import { random, range } from "lodash";
import { Injectable } from '@angular/core';
import { GeoPoint } from './geo-point';
import { Address } from './address';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GeocodeService {
  constructor() {}

  geoPointToAddress(geoPoint: GeoPoint): Observable<Address> {
    // TODO: implement
    return of(Address.forge()).pipe(delay(2000));
  }

  addressToGeoPoints(address: Address): Observable<GeoPoint[]> {
    // TODO: implement
    return of(range(random(3, 7)).map(() => GeoPoint.forge())).pipe(delay(2000));
  }

  // geocode(address: string): Observable<Coordinates[]> {
  //   return this.googleMapsApiService.getGoogleMapsApi().pipe(
  //     flatMap(googleMapsApi => {
  //       const doneGeocoding = new AsyncSubject<any[]>();
  //       const geocoder: google.maps.Geocoder = new googleMapsApi.Geocoder();
  //       geocoder.geocode({
  //         address: address
  //       }, (results, status) => {
  //         if (status.toString() === 'OK') {
  //           doneGeocoding.next(results);
  //         } else {
  //           doneGeocoding.error(status);
  //         }
  //         doneGeocoding.complete();
  //       });
  //       return doneGeocoding;
  //     }),
  //     map(geocodeResults => {
  //       return geocodeResults.map(result => {
  //         return {
  //           latitude: result.geometry.location.lat(),
  //           longitude: result.geometry.location.lng()
  //         };
  //       });
  //     }),
  //     timeout(5000)
  //   );
  // }

  // reverseGeocode(coordinates: any): Observable<any[]> {
  //   return this.googleMapsApiService.getGoogleMapsApi().pipe(
  //     flatMap(googleMapsApi => {
  //       const doneGeocoding = new AsyncSubject<any[]>();
  //       const geocoder: google.maps.Geocoder = new googleMapsApi.Geocoder();
  //       geocoder.geocode({
  //         'location': {
  //           lat: coordinates.latitude,
  //           lng: coordinates.longitude
  //         }
  //       }, (results, status) => {
  //         if (status.toString() === 'OK') {
  //           doneGeocoding.next(results);
  //         } else {
  //           doneGeocoding.error(status);
  //         }
  //         doneGeocoding.complete();
  //       });
  //       return doneGeocoding;
  //     }),
  //     timeout(5000)
  //   );
  // }
}
