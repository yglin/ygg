import {
  Component,
  OnDestroy,
  forwardRef,
  Input,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { Subscription, noop } from 'rxjs';
import { GeoPoint, getUserLocation } from '@ygg/shared/geography/core';
import * as leaflet from 'leaflet';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import { debounceTime } from 'rxjs/operators';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-geo-point-control',
  templateUrl: './geo-point-control.component.html',
  styleUrls: ['./geo-point-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeoPointControlComponent),
      multi: true
    }
  ]
})
export class GeoPointControlComponent
  implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {
  @Input() label: string;
  @Input() showMap = true;
  emitChange: (value: GeoPoint) => any = noop;
  formGroup: FormGroup;
  subscription = new Subscription();

  private _geoPoint: GeoPoint = new GeoPoint();
  set geoPoint(value: GeoPoint) {
    if (GeoPoint.isGeoPoint(value)) {
      this._geoPoint = new GeoPoint().fromJSON(value);
      // console.log('Emit change of GeoPoint');
      // console.log(this._geoPoint);
      this.emitChange(this._geoPoint);
    }
  }
  get geoPoint(): GeoPoint {
    return this._geoPoint;
  }
  // Leaflet map instance
  private map: leaflet.Map;
  private markersLayer: leaflet.LayerGroup = leaflet.layerGroup();

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group(this.geoPoint.toJSON());
    this.subscription.add(
      this.formGroup.valueChanges.pipe(debounceTime(500)).subscribe(value => {
        if (GeoPoint.isGeoPoint(value)) {
          this.geoPoint = GeoPoint.fromLatLng(value.latitude, value.longitude);
          if (this.map) {
            const latlng = {
              lat: value.latitude,
              lng: value.longitude
            };
            this.setMarker(latlng);
          }
        }
      })
    );
  }

  ngOnInit() {}

  async ngAfterViewInit() {
    await this.initMap();
    if (GeoPoint.isGeoPoint(this.geoPoint)) {
      const latlng = {
        lat: this.geoPoint.latitude,
        lng: this.geoPoint.longitude
      };
      this.setMarker(latlng);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  writeValue(value: GeoPoint) {
    // console.log(`Write geopoint value ${value}`);
    if (GeoPoint.isGeoPoint(value)) {
      this._geoPoint = new GeoPoint().fromJSON(value);
      if (this.formGroup) {
        this.formGroup.setValue(this._geoPoint.toJSON(), { emitEvent: false });
      }
      if (this.map) {
        const latlng = {
          lat: this.geoPoint.latitude,
          lng: this.geoPoint.longitude
        };
        this.setMarker(latlng);
      }
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched() {}

  onChangeMapMarker(geoPoint: GeoPoint) {
    this.geoPoint = geoPoint;
    this.formGroup.setValue(this.geoPoint.toJSON());
  }

  setMarker(latlng: leaflet.LatLngLiteral) {
    this.markersLayer.clearLayers();
    const markerIcon: leaflet.Icon = leaflet.icon({
      iconUrl: '/assets/images/map/leaflet-marker-icon.png',
      shadowUrl: '/assets/images/map/leaflet-marker-shadow.png',
      iconSize: [64, 64],
      shadowSize: [64, 64],
      iconAnchor: [32, 64],
      shadowAnchor: [16, 64],
      popupAnchor: [0, -70]
    });
    const lfMarker: leaflet.Marker = leaflet.marker([latlng.lat, latlng.lng], {
      icon: markerIcon,
      alt: 'Set Location Here'
    });
    lfMarker.addTo(this.markersLayer);
    this.map.flyTo(latlng);
  }

  onClickMap(e: leaflet.LeafletEvent) {
    const event = e as leaflet.LeafletMouseEvent;
    this.setMarker(event.latlng);
    this.onChangeMapMarker(
      new GeoPoint({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng
      })
    );
  }

  async initMap() {
    let center = this._geoPoint;
    if (!GeoPoint.isGeoPoint(center)) {
      center = await getUserLocation();
    }
    this.map = leaflet.map('ygg-geopoint-control-leaflet-map', {
      center: [center.latitude, center.longitude],
      zoom: 15
    });
    const tiles = leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    );
    tiles.addTo(this.map);
    this.markersLayer.addTo(this.map);
    this.map.on('click', event => this.onClickMap(event));
  }
}
