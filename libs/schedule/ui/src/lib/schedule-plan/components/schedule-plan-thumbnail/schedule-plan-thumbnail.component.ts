import { isEmpty } from "lodash";
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SchedulePlanService } from '@ygg/schedule/data-access';
import { SchedulePlan } from '@ygg/schedule/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ygg-schedule-plan-thumbnail',
  templateUrl: './schedule-plan-thumbnail.component.html',
  styleUrls: ['./schedule-plan-thumbnail.component.css']
})
export class SchedulePlanThumbnailComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Output() click: EventEmitter<string> = new EventEmitter();
  schedulePlan: SchedulePlan;
  subscriptions: Subscription[] = [];

  constructor(private schedulePlanService: SchedulePlanService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.id) {
      this.subscriptions.push(
        this.schedulePlanService
          .get$(this.id)
          .subscribe(form => (this.schedulePlan = form))
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
