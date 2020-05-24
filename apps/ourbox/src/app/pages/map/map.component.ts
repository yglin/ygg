import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as leaflet from 'leaflet';
import { range, random, extend } from 'lodash';
import { GeoPoint, Location } from '@ygg/shared/omni-types/core';
import {
  forgeItems,
  Item,
  ItemFilter,
  CellNames,
  GeoBound
} from '@ygg/ourbox/core';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import { BehaviorSubject, Subject, Observable, merge } from 'rxjs';
import { switchMap, tap, map, debounceTime } from 'rxjs/operators';
import { ItemFactoryService } from '../../item-factory.service';
import { FormControl } from '@angular/forms';

class Marker {
  static fromItem(item: Item): Marker {
    return new Marker({
      id: item.id,
      name: item.name,
      imgUrl: item.image,
      geoPoint: (item.getCellValue(CellNames.location) as Location).geoPoint
    });
  }

  constructor(options: any = {}) {
    extend(this, options);
  }

  geoPoint: GeoPoint;
  name: string;
  imgUrl: string;
  id: string;
}

@Component({
  selector: 'ygg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: any;
  markersLayer = leaflet.layerGroup();
  center: GeoPoint;
  filter: ItemFilter = new ItemFilter();
  filter$: Observable<ItemFilter>;
  boundChange$: Subject<GeoBound> = new Subject();
  // keywordSearch$: Subject<string> = new Subject();
  formControlKeyword: FormControl = new FormControl();

  constructor(private itemFactory: ItemFactoryService) {
    this.filter$ = merge(
      this.boundChange$.pipe(
        tap((bound: GeoBound) => (this.filter.geoBound = bound))
      ),
      this.formControlKeyword.valueChanges.pipe(
        debounceTime(500),
        tap(keyword => (this.filter.keywordName = keyword))
      )
    ).pipe(map(() => this.filter));

    this.filter$
      .pipe(
        switchMap(filter => this.itemFactory.find(filter)),
        tap((items: Item[]) => {
          this.clearMarkers();
          this.addMarkers(items.map(item => Marker.fromItem(item)));
        })
      )
      .subscribe();
  }

  async getUserLocation(): Promise<GeoPoint> {
    if (navigator && navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => resolve(new GeoPoint(position.coords)),
          error => {
            console.warn(error.message);
            resolve(new GeoPoint());
          }
        );
      });
    } else {
      return new GeoPoint();
    }
  }

  ngOnInit() {}

  async ngAfterViewInit() {
    this.center = await this.getUserLocation();
    this.initMap(this.center);
    this.onMapBoundChange();
    // const filter = new ItemFilter();
    // filter.setGeoBoundary(this.map.getBounds());
    // this.filter$.next(filter);
  }

  clearMarkers() {
    this.markersLayer.clearLayers();
  }

  addMarkers(markers: Marker[]) {
    for (const marker of markers) {
      const lfMarker = leaflet.marker([
        marker.geoPoint.latitude,
        marker.geoPoint.longitude
      ]);
      const link = `/items/${marker.id}`;
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
      lfMarker.addTo(this.markersLayer);
    }
  }

  onMapBoundChange() {
    const leafletBound = this.map.getBounds();
    const geoBound = new GeoBound({ bound: leafletBound });
    this.boundChange$.next(geoBound);
  }

  initMap(center: GeoPoint): void {
    this.map = leaflet.map('ourbox-main-map', {
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
