import { Component, OnInit, Input } from '@angular/core';
import { DayTimeRange } from '@ygg/shared/omni-types/core'

@Component({
  selector: 'ygg-day-time-range-view',
  templateUrl: './day-time-range-view.component.html',
  styleUrls: ['./day-time-range-view.component.css']
})
export class DayTimeRangeViewComponent implements OnInit {
  @Input() dayTimeRange: DayTimeRange;

  constructor() { }

  ngOnInit() {
    // console.log(this.dayTimeRange);
  }

}
