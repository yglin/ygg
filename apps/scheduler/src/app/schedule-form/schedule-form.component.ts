import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'ygg-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      dateRange: {
        start: moment().add(1, 'month').toDate(),
        end: moment().add(1, 'month').add(1, 'week').toDate()
      },
      numParticipants: 10
    });
  }

  ngOnInit() {}
}
