/// <reference types="@types/googlemaps" />
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone
} from '@angular/core';
import { GeoPoint } from '@ygg/shared/omni-types/core';
import { Subscription } from 'rxjs';
import { GeolocationService } from '../geolocation.service';
import { finalize } from 'rxjs/operators';
import { GoogleMapsApiService } from '../../google-maps-api.service';

@Component({
  selector: 'ygg-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() geoPoint: GeoPoint = new GeoPoint();
  @Input() readonly: boolean;
  @Output() changeGeoPoint: EventEmitter<GeoPoint> = new EventEmitter();
  @ViewChild('googleMap', { static: false }) googleMapElement: ElementRef;

  subscriptions: Subscription[] = [];
  zoom = 14;
  googleMap: google.maps.Map;
  mainMarker: google.maps.Marker;

  mapReady = false;
  isSupportMyLocation = false;
  isSearchingMyLocation = false;

  constructor(
    private geolocationService: GeolocationService,
    private googleMapsApiService: GoogleMapsApiService,
    private ngZone: NgZone
  ) {
    this.isSupportMyLocation = this.geolocationService.isSupport();
  }

  ngOnInit() {
    this.readonly = this.readonly !== undefined && this.readonly !== false;
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.googleMapsApiService.getGoogleMapsApi(googleMapsApi =>
      this.onLoadedGoogleMapsApi()
    );
  }

  ngOnChanges() {
    if (this.geoPoint) {
      this.setMainMarker(this.geoPoint);
      this.setMapCenter(this.geoPoint);
    }
  }

  onLoadedGoogleMapsApi() {
    if (!this.googleMap) {
      this.googleMap = new google.maps.Map(this.googleMapElement.nativeElement, {
        zoom: this.zoom,

      });
      this.googleMap.addListener('click', event => this.ngZone.run(() => {
        this.onMapClick(event);
      }));
    }
    if (this.geoPoint) {
      this.setMainMarker(this.geoPoint);
      this.setMapCenter(this.geoPoint);
    }
    this.mapReady = true;
  }

  // onMapReady(map: google.maps.Map) {
  //   this.mapReady = true;
  //   this.googleMap = map;
  //   if (this.geoPoint) {
  //     this.setMainMarker(this.geoPoint);
  //     this.setMapCenter(this.geoPoint);
  //   }
  // }

  setMainMarker(geoPoint: GeoPoint) {
    if (this.googleMap) {
      if (this.mainMarker) {
        this.mainMarker.setMap(null);
      }
      this.mainMarker = new google.maps.Marker({
        position: geoPoint.toGoogleMapsLatLng(),
        animation: google.maps.Animation.DROP
      });
      this.mainMarker.setMap(this.googleMap);
    }
  }

  setMapCenter(geoPoint: GeoPoint) {
    if (this.googleMap) {
      this.googleMap.setCenter(geoPoint.toGoogleMapsLatLng());
    }
  }

  onMapClick(mouseEvent: google.maps.MouseEvent) {
    if (!this.readonly) {
      this.geoPoint = GeoPoint.fromGoogleMapsLatLng(mouseEvent.latLng);
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
