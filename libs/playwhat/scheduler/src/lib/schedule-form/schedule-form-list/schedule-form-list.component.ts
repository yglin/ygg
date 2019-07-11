import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ScheduleForm } from '../schedule-form';
import { AuthenticateService, User } from '@ygg/shared/user';
import { ScheduleFormService } from '../schedule-form.service';
import { Subscription, EMPTY } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Query } from '@ygg/shared/infra/data-access';

@Component({
  selector: 'ygg-schedule-form-list',
  templateUrl: './schedule-form-list.component.html',
  styleUrls: ['./schedule-form-list.component.css']
})
export class ScheduleFormListComponent implements OnInit, OnDestroy {
  @Input() ids: string[];
  title = '遊程需求表單';
  subscriptions: Subscription[] = [];

  constructor(
    private authenticateService: AuthenticateService,
    private scheduleFormService: ScheduleFormService
  ) {}

  ngOnInit() {
    if (!this.ids) {
      this.subscriptions.push(
        this.authenticateService.currentUser$
          .pipe(
            switchMap(user => {
              if (User.isUser(user)) {
                const query = new Query('creatorId', '==', user.id);
                return this.scheduleFormService.find$(query);
              } else {
                return EMPTY;
              }
            }),
            map(scheduleForms => scheduleForms.map(form => form.id))
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
