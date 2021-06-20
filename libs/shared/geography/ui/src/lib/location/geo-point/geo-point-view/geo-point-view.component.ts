import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { GeoPoint, getUserLocation } from '@ygg/shared/geography/core';
import * as leaflet from 'leaflet';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-geo-point-view',
  templateUrl: './geo-point-view.component.html',
  styleUrls: ['./geo-point-view.component.css']
})
export class GeoPointViewComponent implements OnInit, AfterViewInit {
  @Input() geoPoint: GeoPoint;
  zoom = 12;

  // Leaflet map instance
  private map: leaflet.Map;
  private markersLayer: leaflet.LayerGroup = leaflet.layerGroup();

  constructor() {}

  ngOnInit() {}

  async ngAfterViewInit() {
    if (GeoPoint.isGeoPoint(this.geoPoint)) {
      await this.initMap();
    }
  }

  async initMap() {
    const center = {
      lat: this.geoPoint.latitude,
      lng: this.geoPoint.longitude
    };
    this.map = leaflet.map('ygg-geopoint-view-leaflet-map', {
      center,
      zoom: this.zoom
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
    const lfMarker: leaflet.Marker = leaflet.marker(center, {
      icon: markerIcon,
      alt: 'Here'
    });
    lfMarker.addTo(this.markersLayer);
  }
}
