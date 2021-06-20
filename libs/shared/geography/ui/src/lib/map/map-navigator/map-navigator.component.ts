import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  GeoBound,
  GeoPoint,
  getUserLocation,
  Located
} from '@ygg/shared/geography/core';
import { getEnv } from '@ygg/shared/infra/core';
import * as leaflet from 'leaflet';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import { isEmpty } from 'lodash';
import { Subscription } from 'rxjs';
import { Marker } from '../marker/marker';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-map-navigator',
  templateUrl: './map-navigator.component.html',
  styleUrls: ['./map-navigator.component.css']
})
export class MapNavigatorComponent implements OnInit, OnChanges {
  @Input() items: Located[] = [];
  @Input() center: GeoPoint;
  @Output() boundChanged: EventEmitter<GeoBound> = new EventEmitter();
  @Output() clickItem: EventEmitter<Located> = new EventEmitter();
  markersLayer = leaflet.layerGroup();
  subscription: Subscription = new Subscription();
  isTesting = !!getEnv('test') ? true : false;
  form: FormGroup;

  private map: any;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      center: null
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.clearMarkers();
    if (!isEmpty(this.items)) {
      this.addMarkers(this.items.map(item => Marker.fromItem(item)));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {}

  async ngAfterViewInit() {
    await this.initMap();
    this.onMapBoundChange();
    this.subscription.add(
      this.form.get('center').valueChanges.subscribe((gp: GeoPoint) => {
        this.map.panTo([gp.latitude, gp.longitude]);
      })
    );
    // const filter = new ItemFilter();
    // filter.setGeoBoundary(this.map.getBounds());
    // this.filter$.next(filter);
  }

  clearMarkers() {
    this.markersLayer.clearLayers();
  }

  addMarkers(markers: Marker[]) {
    const markerIcon = leaflet.icon({
      iconUrl: '/assets/images/map/marker.png',
      shadowUrl: '/assets/images/map/marker-shadow.png',
      iconSize: [64, 64],
      shadowSize: [64, 64],
      iconAnchor: [32, 64],
      shadowAnchor: [0, 64],
      popupAnchor: [0, -70]
    });
    for (const marker of markers) {
      const lfMarker = leaflet.marker(
        [marker.geoPoint.latitude, marker.geoPoint.longitude],
        {
          icon: markerIcon,
          alt: marker.name
        }
      );
      if (marker.name && marker.imgUrl) {
        const link = `/box/${marker.id}`;
        const target = `ourbox_item_${marker.id}`;
        const popup = lfMarker.bindPopup(
          `<a href="${link}" target="${target}">
            <div class="map-popup">
              <img src='${marker.imgUrl}' />
              <h2>${marker.name}</h2>
            </div>
          </a>
          `
        );
        lfMarker.on('mouseover', () => popup.openPopup());
      }
      lfMarker.on('click', () => this.clickItem.emit(marker.item));
      lfMarker.addTo(this.markersLayer);
    }
  }

  onMapBoundChange() {
    const leafletBound = this.map.getBounds();
    const geoBound = new GeoBound({
      east: leafletBound.getEast(),
      west: leafletBound.getWest(),
      north: leafletBound.getNorth(),
      south: leafletBound.getSouth()
    });
    this.boundChanged.emit(geoBound);
  }

  // setMapBound() {
  //   const geoBound = new GeoBound(
  //     mapValues(this.formGroupMapBound.value, v => parseFloat(v)) as any
  //   );
  //   this.map.fitBounds([
  //     [geoBound.south, geoBound.west],
  //     [geoBound.north, geoBound.east]
  //   ]);
  //   this.boundChange$.next(geoBound);
  // }

  async initMap() {
    let center = this.center;
    if (!GeoPoint.isGeoPoint(center)) {
      center = await getUserLocation();
    }
    this.map = leaflet.map('ygg-leaflet-map', {
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
    this.map.on('zoomlevelschange', () => this.onMapBoundChange());
    this.map.on('moveend', () => this.onMapBoundChange());
  }
}
