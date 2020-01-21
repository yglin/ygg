import { isEmpty } from 'lodash';
import { Component, OnInit } from '@angular/core';
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
export class MyThingsComponent implements OnInit {
  myThings$: Observable<TheThing[]>;
  // filterChange$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(new TheThingFilter());
  // subscriptions: Subscription[] = [];

  constructor(
    private theThingAccessService: TheThingAccessService,
    private authenticateService: AuthenticateService,
    private router: Router
  ) {}

  ngOnInit() {
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
  }

  onClickTheThing(theThing: TheThing) {
    if (theThing) {
      this.router.navigate(['/the-things', theThing.id]);
    }
  }
}
