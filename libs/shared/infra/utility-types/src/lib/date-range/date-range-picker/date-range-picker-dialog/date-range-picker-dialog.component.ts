import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';
import * as moment from 'moment';
import {DaterangepickerComponent} from 'ngx-daterangepicker-material';

import {DateRange, DateRangeMoment} from '../../date-range';

export interface DateRangePickerDialogData {
  dateRange: DateRange
}

@Component({
  selector: 'ygg-date-range-picker-dialog',
  templateUrl: './date-range-picker-dialog.component.html',
  styleUrls: ['./date-range-picker-dialog.component.css']
})
export class DateRangePickerDialogComponent implements OnInit, AfterViewInit, YggDialogContentComponent {
  dateRange: DateRangeMoment;
  dialogData: any;
  @ViewChild(DaterangepickerComponent) datePicker: DaterangepickerComponent;

  constructor(private dialogRef: MatDialogRef<DateRangePickerDialogComponent>) {
  }

  ngOnInit() {
    if (this.dialogData && this.dialogData.dateRange) {
      this.dateRange = this.dialogData.dateRange.toMoment();
    } else {
      this.dateRange = {
        start: moment().add(1, 'month'),
        end: moment().add(1, 'month').add(1, 'week')
      };
    }
  }

  ngAfterViewInit() {
    this.datePicker.setStartDate(this.dateRange.start);
    this.datePicker.setEndDate(this.dateRange.end);
    setTimeout(() => {
      this.datePicker.updateCalendars();
    }, 0);
  }

  onRangeSelected(rangeValues: any) {
    // console.log(rangeValues);
    this.dateRange = {start: rangeValues.startDate, end: rangeValues.endDate};
  }

  submit() {
    const outDateRange = new DateRange().fromMoment(this.dateRange);
    this.dialogRef.close(outDateRange);
  }

  cancel() {
    this.dialogRef.close();
  }
}
