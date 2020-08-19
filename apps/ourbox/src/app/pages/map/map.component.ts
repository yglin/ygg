import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  GeoBound,
  ImitationItemCells,
  ItemFilter,
  ImitationItem
} from '@ygg/ourbox/core';
import { GeoPoint, Location } from '@ygg/shared/omni-types/core';
import { TheThing } from '@ygg/the-thing/core';
import * as leaflet from 'leaflet';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import { extend } from 'lodash';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { BoxFactoryService } from '../../box-factory.service';

class Marker {
  geoPoint: GeoPoint;
  name: string;
  imgUrl: string;
  id: string;

  static fromItem(item: TheThing): Marker {
    return new Marker({
      id: item.id,
      name: item.name,
      imgUrl: item.image,
      geoPoint: (item.getCellValue(
        ImitationItemCells.location.id
      ) as Location).geoPoint
    });
  }

  constructor(options: any = {}) {
    extend(this, options);
  }
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

  constructor(private boxFactory: BoxFactoryService) {
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
        switchMap(filter => this.boxFactory.findItems$(filter)),
        tap((items: TheThing[]) => {
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
      const link = `/${ImitationItem.routePath}/${marker.id}`;
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
