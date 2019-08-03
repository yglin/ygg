import { Component, OnInit } from '@angular/core';
import { BusinessHours } from '../business-hours';
import { OpenHour } from "../open-hour";

@Component({
  selector: 'ygg-business-hours-control',
  templateUrl: './business-hours-control.component.html',
  styleUrls: ['./business-hours-control.component.css']
})
export class BusinessHoursControlComponent implements OnInit {
  private _businessHours: BusinessHours;
  set businessHours(value: BusinessHours) {
    if (value && BusinessHours.isBusinessHours(value)) {
      this._businessHours = value;
    }
  }
  get businessHours(): BusinessHours {
    return this._businessHours;
  }
  constructor() { }

  ngOnInit() {
  }

  clearAll() {
  }

  addOpenHour(openHour: OpenHour) {
  }

  addOpenHourForAll7Days(start: Date, end: Date) {

  }

  deleteOpenHour(index: number) {
  }
}
