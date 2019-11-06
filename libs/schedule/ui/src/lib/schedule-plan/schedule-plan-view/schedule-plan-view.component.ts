import { Component, OnInit, Input } from '@angular/core';
import { SchedulePlan } from '@ygg/schedule/core';
import { TranspotationTypes } from '@ygg/schedule/core';import { AuthenticateService, User } from '@ygg/shared/user';

@Component({
  selector: 'ygg-schedule-plan-view',
  templateUrl: './schedule-plan-view.component.html',
  styleUrls: ['./schedule-plan-view.component.css']
})
export class SchedulePlanViewComponent implements OnInit {
  @Input() schedulePlan: SchedulePlan;
  transpotationTypes = TranspotationTypes;

  constructor() {}

  ngOnInit() {
  }
}
