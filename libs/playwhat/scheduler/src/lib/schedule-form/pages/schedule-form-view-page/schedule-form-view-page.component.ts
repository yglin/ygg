import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ScheduleForm } from '../../schedule-form';
import { Observable, Subscription, merge } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { User, AuthenticateService } from '@ygg/shared/user';

@Component({
  selector: 'ygg-schedule-form-view-page',
  templateUrl: './schedule-form-view-page.component.html',
  styleUrls: ['./schedule-form-view-page.component.css']
})
export class ScheduleFormViewPageComponent implements OnInit, OnDestroy {
  scheduleForm: ScheduleForm;
  currentUser: User;
  isCreator = false;
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticateService: AuthenticateService
  ) {}

  ngOnInit() {
    const scheduleForm$: Observable<ScheduleForm> = this.route.data.pipe(
      map(data => {
        if (data && data.scheduleForm) {
          this.scheduleForm = data.scheduleForm;
        }
        return this.scheduleForm;
      })
    );
    const currentUser$: Observable<
      User
    > = this.authenticateService.currentUser$.pipe(
      tap(user => (this.currentUser = user))
    );
    this.subscriptions.push(
      merge(scheduleForm$, currentUser$).subscribe(() => {
        if (
          this.currentUser &&
          this.scheduleForm &&
          this.scheduleForm.creatorId === this.currentUser.id
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

}
