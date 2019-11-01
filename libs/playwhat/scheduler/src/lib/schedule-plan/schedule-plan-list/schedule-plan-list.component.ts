import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SchedulePlan } from '../schedule-plan';
import { AuthenticateService, User } from '@ygg/shared/user';
import { SchedulePlanService } from '../schedule-plan.service';
import { Subscription, EMPTY } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Query } from '@ygg/shared/infra/data-access';

@Component({
  selector: 'ygg-schedule-plan-list',
  templateUrl: './schedule-plan-list.component.html',
  styleUrls: ['./schedule-plan-list.component.css']
})
export class SchedulePlanListComponent implements OnInit, OnDestroy {
  @Input() ids: string[];
  title = '遊程需求表單';
  subscriptions: Subscription[] = [];

  constructor(
    private authenticateService: AuthenticateService,
    private schedulePlanService: SchedulePlanService
  ) {}

  ngOnInit() {
    if (!this.ids) {
      this.subscriptions.push(
        this.authenticateService.currentUser$
          .pipe(
            switchMap(user => {
              if (User.isUser(user)) {
                const query = new Query('creatorId', '==', user.id);
                return this.schedulePlanService.find$(query);
              } else {
                return EMPTY;
              }
            }),
            map(schedulePlans => schedulePlans.map(form => form.id))
          )
          .subscribe(ids => (this.ids = ids))
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
