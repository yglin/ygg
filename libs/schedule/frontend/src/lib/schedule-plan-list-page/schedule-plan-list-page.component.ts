import { isEmpty } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SchedulePlan } from '@ygg/schedule/core';

@Component({
  selector: 'ygg-schedule-plan-list-page',
  templateUrl: './schedule-plan-list-page.component.html',
  styleUrls: ['./schedule-plan-list-page.component.css']
})
export class SchedulePlanListPageComponent implements OnInit {
  schedulePlans: SchedulePlan[];
  title = '我的遊程計畫';
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.route.data) {
      this.subscriptions.push(
        this.route.data.subscribe(data => {
          // console.log(data);
          if (data && !isEmpty(data.schedulePlans)) {
            this.schedulePlans = data.schedulePlans;
          }
        })
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
