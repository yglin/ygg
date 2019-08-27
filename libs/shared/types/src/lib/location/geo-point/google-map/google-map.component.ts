/// <reference types="@types/googlemaps" />
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { GeoPoint } from '../geo-point';
import { MouseEvent } from '@agm/core';
import { Subscription } from 'rxjs';
import { GeolocationService } from '../geolocation.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'ygg-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit, OnChanges {
  @Input() geoPoint: GeoPoint = new GeoPoint();
  @Input() readonly: boolean;
  @Output() changeGeoPoint: EventEmitter<GeoPoint> = new EventEmitter();
  subscriptions: Subscription[] = [];
  zoom = 14;
  googleMap: google.maps.Map;
  mainMarker: google.maps.Marker;
  isMapReady = false;
  isSupportMyLocation = false;
  isSearchingMyLocation = false;

  constructor(private geolocationService: GeolocationService) {
    this.isSupportMyLocation = this.geolocationService.isSupport();
  }

  ngOnInit() {
    this.readonly = this.readonly !== undefined && this.readonly !== false;
  }

  ngOnChanges() {
    if (this.geoPoint) {
      this.setMainMarker(this.geoPoint);
      this.setMapCenter(this.geoPoint);
    }
  }

  onMapReady(map: google.maps.Map) {
    this.isMapReady = true;
    this.googleMap = map;
    if (this.geoPoint) {
      this.setMainMarker(this.geoPoint);
      this.setMapCenter(this.geoPoint);
    }
  }

  setMainMarker(geoPoint: GeoPoint) {
    if (this.googleMap) {
      if (this.mainMarker) {
        this.mainMarker.setMap(null);
      }
      this.mainMarker = new google.maps.Marker({
        position: geoPoint.toGoogleMapsLatLng(),
        animation: google.maps.Animation.DROP
      });
      if (this.googleMap) {
        this.mainMarker.setMap(this.googleMap);
      }
    }
  }

  setMapCenter(geoPoint: GeoPoint) {
    if (this.googleMap) {
      this.googleMap.setCenter(geoPoint.toGoogleMapsLatLng());
    }
  }

  onMapClick(mouseEvent: MouseEvent) {
    if (!this.readonly) {
      this.geoPoint = GeoPoint.fromGoogleMapsLatLng(mouseEvent.coords);
      this.changeGeoPoint.emit(this.geoPoint);
      this.setMapCenter(this.geoPoint);
      this.setMainMarker(this.geoPoint);
    }
  }

  toMyLocation() {
    if (!this.readonly) {
      this.isSearchingMyLocation = true;
      this.subscriptions.push(
        this.geolocationService
          .getCurrentPosition()
          .pipe(finalize(() => (this.isSearchingMyLocation = false)))
          .subscribe(myLocation => {
            this.geoPoint = myLocation;
            this.setMapCenter(this.geoPoint);
            this.setMainMarker(this.geoPoint);
            this.changeGeoPoint.emit(this.geoPoint);
            this.isSearchingMyLocation = false;
          })
      );
    }
  }
}
