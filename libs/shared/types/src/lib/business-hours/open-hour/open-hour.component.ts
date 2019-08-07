import { Component, OnInit, Input } from '@angular/core';
import { OpenHour } from './open-hour';

@Component({
  selector: 'ygg-open-hour',
  templateUrl: './open-hour.component.html',
  styleUrls: ['./open-hour.component.css']
})
export class OpenHourComponent implements OnInit {
  @Input() openHour: OpenHour;
  
  constructor() { }

  ngOnInit() {
  }

}
