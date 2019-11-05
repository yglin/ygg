import { isEmpty } from 'lodash';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SchedulePlan } from '@ygg/schedule/core';
import { AuthenticateService, User } from '@ygg/shared/user';
import { SchedulePlanService } from '@ygg/schedule/data-access';
import { Subscription, EMPTY } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Query } from '@ygg/shared/infra/data-access';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ygg-schedule-plan-list',
  templateUrl: './schedule-plan-list.component.html',
  styleUrls: ['./schedule-plan-list.component.css']
})
export class SchedulePlanListComponent implements OnInit, OnDestroy {
  @Input() schedulePlans: SchedulePlan[];
  title = '我的遊程計畫';
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

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
