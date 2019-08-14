import { noop } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { Location } from '../location';

@Component({
  selector: 'ygg-location-control',
  templateUrl: './location-control.component.html',
  styleUrls: ['./location-control.component.css']
})
export class LocationControlComponent implements OnInit {
  private _location: Location;
  set location(value: Location) {
    if (value) {
      this._location = value;
      this.emitChange(this._location);
    }
  }
  get location(): Location {
    return this._location;
  }

  emitChange: (location: Location) => any = noop;

  constructor() { }

  ngOnInit() {
  }

}
