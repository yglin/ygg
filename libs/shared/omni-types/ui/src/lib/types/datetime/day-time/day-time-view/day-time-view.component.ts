import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DayTime } from '@ygg/shared/omni-types/core';
@Component({
  selector: 'ygg-day-time-view',
  templateUrl: './day-time-view.component.html',
  styleUrls: ['./day-time-view.component.css']
})
export class DayTimeViewComponent implements OnInit, OnChanges {
  @Input() dayTime: DayTime | Date;
  formattedDayTime: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dayTime instanceof Date) {
      this.dayTime = DayTime.fromDate(this.dayTime);
    }
    if (DayTime.isDayTime(this.dayTime)) {
      this.formattedDayTime = this.dayTime.format(DayTime.DISPLAY_FORMAT);
    } else {
      this.formattedDayTime = `Error: ${this.dayTime}`;
    }
  }

  ngOnInit() {}
}
