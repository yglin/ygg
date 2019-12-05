import { Component, OnInit, Input } from '@angular/core';
import { Accommodation } from '@ygg/resource/core';

@Component({
  selector: 'ygg-accommodation-thumbnail',
  templateUrl: './accommodation-thumbnail.component.html',
  styleUrls: ['./accommodation-thumbnail.component.css']
})
export class AccommodationThumbnailComponent implements OnInit {
  @Input() accommodation: Accommodation;
  
  constructor() { }

  ngOnInit() {
  }

}
