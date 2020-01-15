import { isEmpty } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import {
  Subscription,
  of,
  BehaviorSubject,
  combineLatest,
  throwError
} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { AuthenticateService } from '@ygg/shared/user';

@Component({
  selector: 'the-thing-my-things',
  templateUrl: './my-things.component.html',
  styleUrls: ['./my-things.component.css']
})
export class MyThingsComponent implements OnInit {
  theThings: TheThing[];
  filterChange$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(new TheThingFilter());
  subscriptions: Subscription[] = [];

  constructor(
    private theThingAccessService: TheThingAccessService,
    private authenticateService: AuthenticateService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.authenticateService.currentUser$
        .pipe(
          switchMap(user => {
            if (user) {
              return combineLatest([
                this.theThingAccessService.listByOwner$(user.id),
                this.filterChange$
              ]);
            } else {
              alert('找不到登入用戶，尚未登入？');
              return of([[], null]);
            }
          })
        )
        .subscribe(([theThings, filter]) => {
          if (filter) {
            this.theThings = (filter as TheThingFilter).filter(theThings)
          } else {
            this.theThings = theThings;
          }
        })
    );
  }

  onFilterChanged(filter: TheThingFilter) {
    this.filterChange$.next(filter);
  }
}
