import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SchedulePlan } from '@ygg/schedule/core';
import { Observable, Subscription, merge } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { User, AuthenticateService } from '@ygg/shared/user';
import { ScheduleFactoryService } from "@ygg/schedule/core";

@Component({
  selector: 'ygg-schedule-plan-view-page',
  templateUrl: './schedule-plan-view-page.component.html',
  styleUrls: ['./schedule-plan-view-page.component.css']
})
export class SchedulePlanViewPageComponent implements OnInit, OnDestroy {
  schedulePlan: SchedulePlan;
  currentUser: User;
  isCreator = false;
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticateService: AuthenticateService,
    private scheduleFactory: ScheduleFactoryService
  ) {}

  ngOnInit() {
    const schedulePlan$: Observable<SchedulePlan> = this.route.data.pipe(
      map(data => {
        if (data && data.schedulePlan) {
          this.schedulePlan = data.schedulePlan;
        }
        return this.schedulePlan;
      })
    );
    const currentUser$: Observable<
      User
    > = this.authenticateService.currentUser$.pipe(
      tap(user => (this.currentUser = user))
    );
    this.subscriptions.push(
      merge(schedulePlan$, currentUser$).subscribe(() => {
        if (
          this.currentUser &&
          this.schedulePlan &&
          this.schedulePlan.creatorId === this.currentUser.id
        ) {
          this.isCreator = true;
        } else {
          this.isCreator = false;
        }
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  gotoEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  async createSchedule() {
    const schedule = await this.scheduleFactory.createSchedule(this.schedulePlan);
    this.router.navigate(['scheduler', 'schedules', schedule.id, 'edit']);
  }
}
