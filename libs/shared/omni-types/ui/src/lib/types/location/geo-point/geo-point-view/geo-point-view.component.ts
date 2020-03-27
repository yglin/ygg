import { Component, OnInit, Input } from '@angular/core';
import { GeoPoint } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-geo-point-view',
  templateUrl: './geo-point-view.component.html',
  styleUrls: ['./geo-point-view.component.css']
})
export class GeoPointViewComponent implements OnInit {
  @Input() geoPoint: GeoPoint;
  zoom = 12;
  isMapReady = false;

  constructor() {}

  ngOnInit() {}

  onMapReady() {
    this.isMapReady = true;
  }
}
