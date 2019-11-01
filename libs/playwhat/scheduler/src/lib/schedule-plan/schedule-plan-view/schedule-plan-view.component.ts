import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SchedulePlan } from '../schedule-plan';
import { ActivatedRoute, Router } from '@angular/router';
import { SchedulePlanService } from '../schedule-plan.service';
import { Subscription, Observable, merge } from 'rxjs';
import { TranspotationTypes } from '../transpotation';
import { AuthenticateService, User } from '@ygg/shared/user';
import { tap, map } from 'rxjs/operators';

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
