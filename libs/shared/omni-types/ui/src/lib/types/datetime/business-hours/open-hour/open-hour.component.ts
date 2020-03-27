import { Component, OnInit, Input } from '@angular/core';
import { OpenHour, getWeekDayName } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-open-hour',
  templateUrl: './open-hour.component.html',
  styleUrls: ['./open-hour.component.css']
})
export class OpenHourComponent implements OnInit {
  @Input() openHour: OpenHour;
  getWeekDayName = getWeekDayName;

  constructor() {}

  ngOnInit() {}
}
