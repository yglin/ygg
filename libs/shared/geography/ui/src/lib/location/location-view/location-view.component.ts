import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@ygg/shared/geography/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.css']
})
export class LocationViewComponent implements OnInit {
  @Input() location: Location;
  @Input() value: Location;

  constructor() {}

  ngOnInit() {
    if (!this.location) {
      this.location = this.value;
    }
  }
}
