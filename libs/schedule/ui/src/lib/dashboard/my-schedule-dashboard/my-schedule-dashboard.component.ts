import { isEmpty } from "lodash";
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SchedulePlan } from '@ygg/schedule/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ygg-my-schedule-dashboard',
  templateUrl: './my-schedule-dashboard.component.html',
  styleUrls: ['./my-schedule-dashboard.component.css']
})
export class MyScheduleDashboardComponent implements OnInit, OnDestroy {
  @Input() schedulePlans: SchedulePlan[];
  subscriptions: Subscription[] = [];
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.data) {
      this.subscriptions.push(this.route.data.subscribe(data => {
        if (data) {
          if (!isEmpty(data.schedulePlans)) {
            this.schedulePlans = data.schedulePlans;
          }
        }
      }));
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
