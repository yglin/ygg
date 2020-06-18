import { Component, OnInit } from '@angular/core';
import { Schedule } from '@ygg/schedule/core';

@Component({
  selector: 'ygg-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedule: Schedule;

  constructor() {}

  ngOnInit(): void {}
}
