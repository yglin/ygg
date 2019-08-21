import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../location';

@Component({
  selector: 'ygg-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.css']
})
export class LocationViewComponent implements OnInit {
  @Input() location: Location;
  
  constructor() { }

  ngOnInit() {
  }

}
