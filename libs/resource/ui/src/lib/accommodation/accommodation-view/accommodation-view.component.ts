import { Component, OnInit, Input } from '@angular/core';
import { Accommodation } from '@ygg/resource/core';

@Component({
  selector: 'ygg-accommodation-view',
  templateUrl: './accommodation-view.component.html',
  styleUrls: ['./accommodation-view.component.css']
})
export class AccommodationViewComponent implements OnInit {
  @Input() accommodation: Accommodation;
  
  constructor() { }

  ngOnInit() {
  }

}
