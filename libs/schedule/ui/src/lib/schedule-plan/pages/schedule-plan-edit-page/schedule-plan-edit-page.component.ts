import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SchedulePlan } from '@ygg/schedule/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ygg-schedule-plan-edit-page',
  templateUrl: './schedule-plan-edit-page.component.html',
  styleUrls: ['./schedule-plan-edit-page.component.css']
})
export class SchedulePlanEditPageComponent implements OnInit, OnDestroy {
  @Input() schedulePlan: SchedulePlan;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    if (this.route.data) {
      this.subscriptions.push(
        this.route.data.pipe(take(1)).subscribe(data => {
          if (data && data.schedulePlan) {
            this.schedulePlan = data.schedulePlan;
          } else {
            this.schedulePlan = new SchedulePlan();
          }
        })
      );
    } else {
      this.schedulePlan = new SchedulePlan();
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onChangeForm(schedulePlan: SchedulePlan) {
    // console.log(schedulePlan);
    this.schedulePlan = schedulePlan;
  }

  onSubmitForm(schedulePlan: SchedulePlan) {
    if (schedulePlan && schedulePlan.id) {
      this.router.navigate(['/', 'scheduler', 'schedule-plans', schedulePlan.id]);
    }
  }
}
