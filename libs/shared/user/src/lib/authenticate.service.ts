import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserState } from '@ygg/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  currentUser$: BehaviorSubject<User>;

  constructor() {
    this.currentUser$ = new BehaviorSubject(null);
    // TODO Real authenticate with firbase authentication
    this.currentUser$.next({
      id: 'ygg54088',
      account: 'ygg9487',
      name: 'ygg9487',
      roles: null,
      state: UserState.New,
      avatar: null
    });
  }
}
