import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { User } from '@ygg/shared/user/core';
import { UserService } from '../../user.service';
import { Subscription, Observable, isObservable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-user-thumbnail',
  templateUrl: './user-thumbnail.component.html',
  styleUrls: ['./user-thumbnail.component.css']
})
export class UserThumbnailComponent implements OnInit, OnDestroy {
  @Input() id$: Observable<string>;
  @Input() id: string;
  @Input() showName;
  user: User;
  subscriptions: Subscription[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    // console.log(`showName=${this.showName}`);
    if (isObservable(this.id$)) {
      this.subscriptions.push(
        this.id$
          .pipe(switchMap(id => this.userService.get$(id)))
          .subscribe(user => (this.user = user))
      );
    } else if (this.id) {
      this.subscriptions.push(
        this.userService.get$(this.id).subscribe(user => {
          // console.log(user);
          this.user = user;
        })
      );
    }

    // console.log(`showName = ${this.showName}`);
    this.showName =
      this.showName !== 'false' &&
      this.showName !== false &&
      this.showName !== undefined;
    // console.log(`showName = ${this.showName}`);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
