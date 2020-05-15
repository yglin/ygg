import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as leaflet from 'leaflet';
import { range, random } from 'lodash';
import { GeoPoint } from '@ygg/shared/omni-types/core';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';

interface MapItem {
  location: GeoPoint;
  imgUrl: string;
  name: string;
}

@Component({
  selector: 'ygg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: any;
  items: MapItem[] = [];
  center: GeoPoint;
  constructor() {}

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

  addMarkers(items: MapItem[]) {
    console.dir(items);
    for (const item of items) {
      const lfMarker = leaflet
        .marker([item.location.latitude, item.location.longitude])
        .addTo(this.map);
      lfMarker.bindPopup(
        `<img src="${item.imgUrl}"/><div><h5>${item.name}</h5></div>`
      );
    }
  }

  async loadItems(center: GeoPoint): Promise<MapItem[]> {
    return range(10).map(() => {
      const marker: GeoPoint = new GeoPoint({
        latitude: this.center.latitude + random(-0.01, 0.01, true),
        longitude: this.center.longitude + random(-0.01, 0.01, true)
      });
      return {
        name: '呱呱瓜',
        imgUrl:
          'https://image.flaticon.com/icons/png/128/2636/2636941.png',
        location: marker
      };
    });
  }

  async ngAfterViewInit() {
    this.center = await this.getUserLocation();
    this.items = await this.loadItems(this.center);
    this.initMap(this.center);
    this.addMarkers(this.items);
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
  }
}
