import { Component, OnInit, Input } from '@angular/core';
import { Accommodation } from '@ygg/resource/core';

@Component({
  selector: 'ygg-accommodation-control',
  templateUrl: './accommodation-control.component.html',
  styleUrls: ['./accommodation-control.component.css']
})
export class AccommodationControlComponent implements OnInit {
  @Input() accommodation: Accommodation;
  constructor() { }

  ngOnInit() {
  }

}
