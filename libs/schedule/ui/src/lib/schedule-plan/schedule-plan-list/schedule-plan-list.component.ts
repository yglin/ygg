import { Component, OnInit, Input } from '@angular/core';
import { SchedulePlan } from '@ygg/schedule/core';

@Component({
  selector: 'ygg-schedule-plan-list',
  templateUrl: './schedule-plan-list.component.html',
  styleUrls: ['./schedule-plan-list.component.css']
})
export class SchedulePlanListComponent implements OnInit {
  @Input() schedulePlans: SchedulePlan[];

  constructor() {}

  ngOnInit() {
  }
}
