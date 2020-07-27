import { Component, OnInit } from '@angular/core';
import { Schedule } from '@ygg/schedule/core';
import { ScheduleFactoryService } from '../../schedule-factory.service';
import { ActivatedRoute } from '@angular/router';
import { get } from 'lodash';

@Component({
  selector: 'ygg-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedule: Schedule;

  constructor(
    private scheduleFactory: ScheduleFactoryService,
    private route: ActivatedRoute
  ) {
    this.schedule = get(this.route.snapshot.data, "schedule", null);
  }

  ngOnInit(): void {}

  submit() {
    this.scheduleFactory.submit(this.schedule);
  }

  cancel() {
    this.scheduleFactory.cancel(this.schedule);
  }
}
