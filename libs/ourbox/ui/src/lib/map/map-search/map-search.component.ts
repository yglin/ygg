import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ImitationItemCells, ImitationItem } from '@ygg/ourbox/core';
import { GeoPoint, GeoBound } from '@ygg/shared/geography/core';
import { Location } from '@ygg/shared/omni-types/core';
import { TheThing } from '@ygg/the-thing/core';
import * as leaflet from 'leaflet';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import { extend, isEmpty, mapValues } from 'lodash';
import { merge, Observable, Subject, combineLatest, Subscription } from 'rxjs';
import { debounceTime, map, switchMap, tap, startWith } from 'rxjs/operators';
import { MapSearcherService } from '../map-searcher.service';
import { getEnv } from '@ygg/shared/infra/core';

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
      geoPoint: (item.getCellValue(ImitationItemCells.location.id) as Location)
        .geoPoint
    });
  }

  constructor(options: any = {}) {
    extend(this, options);
  }
}

@Component({
  selector: 'ourbox-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.css']
})
export class MapSearchComponent implements OnInit, OnDestroy {
  private map: any;
  markersLayer = leaflet.layerGroup();
  center: GeoPoint;
  boundChange$: Subject<GeoBound> = new Subject();
  // keywordSearch$: Subject<string> = new Subject();
  formControlKeyword: FormControl = new FormControl();
  subscription: Subscription = new Subscription();
  isTesting = !!getEnv('test') ? true : false;
  formGroupMapBound: FormGroup;
  ImitationItem = ImitationItem;
  items: TheThing[] = [];

  constructor(
    private mapSearcher: MapSearcherService,
    private formBuilder: FormBuilder
  ) {
    const itemsInMapBound$: Observable<TheThing[]> = this.boundChange$.pipe(
      debounceTime(500),
      switchMap(bound => this.mapSearcher.searchItemsInBound$(bound))
      // tap(items => {
      //   console.log('Found items in bound');
      //   console.log(items);
      // })
    );

    const keyword$: Observable<string> = this.formControlKeyword.valueChanges.pipe(
      debounceTime(500),
      startWith('')
    );

    const filteredItems$: Observable<TheThing[]> = combineLatest([
      itemsInMapBound$,
      keyword$
    ]).pipe(
      map(([items, keyword]) => {
        if (!!keyword) {
          return items.filter(item => item.name.includes(keyword));
        } else {
          return items;
        }
      })
      // tap(items => {
      //   console.log(`Items filtered by keyword`);
      //   console.log(items);
      // })
    );

    this.subscription.add(
      filteredItems$
        .pipe(
          tap((items: TheThing[]) => {
            this.items = items;
            this.clearMarkers();
            this.addMarkers(items.map(item => Marker.fromItem(item)));
          })
        )
        .subscribe()
    );

    this.formGroupMapBound = this.formBuilder.group({
      east: null,
      west: null,
      north: null,
      south: null
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
        { icon: markerIcon }
      );
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
    const geoBound = new GeoBound({
      east: leafletBound.getEast(),
      west: leafletBound.getWest(),
      north: leafletBound.getNorth(),
      south: leafletBound.getSouth()
    });
    this.boundChange$.next(geoBound);
  }

  setMapBound() {
    const geoBound = new GeoBound(
      mapValues(this.formGroupMapBound.value, v => parseFloat(v)) as any
    );
    this.map.fitBounds([
      [geoBound.south, geoBound.west],
      [geoBound.north, geoBound.east]
    ]);
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
