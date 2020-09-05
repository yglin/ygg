import { Component, OnInit } from '@angular/core';
import { GeoPoint } from '@ygg/shared/geography/core';

@Component({
  selector: 'ygg-google-map-demo',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  geoPoint: GeoPoint = new GeoPoint();

  constructor() { }

  ngOnInit() {
  }

  onMoveMarker(geoPoint: GeoPoint) {
    this.geoPoint = geoPoint;
  }
}
