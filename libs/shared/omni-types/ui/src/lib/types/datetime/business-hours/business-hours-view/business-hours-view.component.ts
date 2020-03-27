import { Component, OnInit, Input } from '@angular/core';
import { BusinessHours } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-business-hours-view',
  templateUrl: './business-hours-view.component.html',
  styleUrls: ['./business-hours-view.component.css']
})
export class BusinessHoursViewComponent implements OnInit {
  @Input() businessHours: BusinessHours;

  constructor() {}

  ngOnInit() {}
}
