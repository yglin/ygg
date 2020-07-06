import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { User } from '@ygg/shared/user/core';
import { UserService } from '../../user.service';
import { Subscription, Observable, isObservable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ygg-user-thumbnail',
  templateUrl: './user-thumbnail.component.html',
  styleUrls: ['./user-thumbnail.component.css']
})
export class UserThumbnailComponent implements OnInit, OnDestroy {
  @Input() id$: Observable<string>;
  @Input() id: string;
  @Input() showName = true;
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
        this.userService.get$(this.id).subscribe(user => (this.user = user))
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
