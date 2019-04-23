import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScheduleFormService } from '../schedule-form/schedule-form.service';

@Component({
  selector: 'ygg-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  scheduleFormGroup: FormGroup;

  constructor(
    private scheduleFormService: ScheduleFormService
  ) {
    this.scheduleFormGroup = this.scheduleFormService.createFormGroup();
  }

  ngOnInit() {
  }

}
