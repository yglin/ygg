import { Component, OnInit, Input } from '@angular/core';
import { DayTime } from '@ygg/shared/omni-types/core';
@Component({
  selector: 'ygg-day-time-view',
  templateUrl: './day-time-view.component.html',
  styleUrls: ['./day-time-view.component.css']
})
export class DayTimeViewComponent implements OnInit {
  @Input() dayTime: DayTime;
  formattedDayTime: string;

  constructor() { }

  ngOnInit() {
    if (this.dayTime) {
      this.formattedDayTime = this.dayTime.format(DayTime.DISPLAY_FORMAT);
    }
  }

}
