import { isEmpty } from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import {
  Subscription,
  of,
  BehaviorSubject,
  combineLatest,
  Observable,
  throwError
} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { AuthenticateService } from '@ygg/shared/user';
import { Router } from '@angular/router';

@Component({
  selector: 'the-thing-my-things',
  templateUrl: './my-things.component.html',
  styleUrls: ['./my-things.component.css']
})
export class MyThingsComponent implements OnInit, OnDestroy {
  myThings$: Observable<TheThing[]>;
  filter$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(null);
  filteredTheThings: TheThing[] = [];
  // filterChange$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(new TheThingFilter());
  subscriptions: Subscription[] = [];

  constructor(
    private theThingAccessService: TheThingAccessService,
    private authenticateService: AuthenticateService,
    private router: Router
  ) {
    this.myThings$ = this.authenticateService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.theThingAccessService.listByOwner$(user.id);
        } else {
          alert('找不到登入用戶，尚未登入？');
          return of([]);
        }
      })
    );
    this.subscriptions.push(
      combineLatest([this.myThings$, this.filter$]).subscribe(
        ([theThings, filter]) => {
          if (filter) {
            this.filteredTheThings = (filter as TheThingFilter).filter(
              theThings
            );
          } else {
            this.filteredTheThings = theThings;
          }
        }
      )
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onClickTheThing(theThing: TheThing) {
    if (theThing) {
      this.router.navigate(['/the-things', theThing.id]);
    }
  }

  onFilterChanged(filter: TheThingFilter) {
    this.filter$.next(filter);
  }

  addTheThing() {
    this.router.navigate(['/', 'the-things', 'create']);
  }
}
