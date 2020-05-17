import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'ygg-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.css']
})
export class DatetimeComponent implements OnInit {
  @Input() value: any;

  dateText = '';

  constructor() {}

  ngOnInit(): void {
    if (this.value instanceof Date) {
      this.dateText = moment(this.value).format('LLL');
    }
  }
}
