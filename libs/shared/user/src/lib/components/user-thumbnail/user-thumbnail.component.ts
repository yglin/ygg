import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-user-thumbnail',
  templateUrl: './user-thumbnail.component.html',
  styleUrls: ['./user-thumbnail.component.css']
})
export class UserThumbnailComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() showName = true;
  user: User;
  subscriptions: Subscription[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    // console.log(`showName=${this.showName}`);
    if (this.id) {
      this.subscriptions.push(this.userService
        .get$(this.id)
        .subscribe(user => (this.user = user)));
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
