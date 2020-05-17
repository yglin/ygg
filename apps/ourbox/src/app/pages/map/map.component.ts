import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as leaflet from 'leaflet';
import { range, random } from 'lodash';
import { GeoPoint } from '@ygg/shared/omni-types/core';
import { forgeItems } from '@ygg/ourbox/core';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';

interface Marker {
  location: GeoPoint;
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
  markers: Marker[] = [];
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

  addMarkers(markers: Marker[]) {
    console.dir(markers);
    for (const marker of markers) {
      const lfMarker = leaflet
        .marker([marker.location.latitude, marker.location.longitude])
        .addTo(this.map);
      const link = `/items/${marker.id}`;
      const target = `ourbox_item_${marker.id}`;
      lfMarker.bindPopup(
        `<a href="${link}" target="${target}">
          <div class="map-popup">
            <img src='${marker.imgUrl}' />
            <h2>${marker.name}</h2>
          </div>
        </a>
        `
      );
    }
  }

  async loadItems(center: GeoPoint): Promise<Marker[]> {
    return forgeItems().map(item => {
      const marker: GeoPoint = new GeoPoint({
        latitude: this.center.latitude + random(-0.01, 0.01, true),
        longitude: this.center.longitude + random(-0.01, 0.01, true)
      });
      return {
        id: item.id,
        name: item.name,
        imgUrl: item.image,
        location: marker
      };
    });
  }

  async ngAfterViewInit() {
    this.center = await this.getUserLocation();
    this.markers = await this.loadItems(this.center);
    this.initMap(this.center);
    this.addMarkers(this.markers);
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
