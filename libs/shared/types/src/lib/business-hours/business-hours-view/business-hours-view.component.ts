import { Component, OnInit, Input } from '@angular/core';
import { BusinessHours } from '../business-hours';

@Component({
  selector: 'ygg-business-hours-view',
  templateUrl: './business-hours-view.component.html',
  styleUrls: ['./business-hours-view.component.css']
})
export class BusinessHoursViewComponent implements OnInit {
  @Input() businessHours: BusinessHours;

  constructor() { }

  ngOnInit() {
  }

}
