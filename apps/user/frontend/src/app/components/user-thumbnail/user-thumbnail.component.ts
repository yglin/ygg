import { Component, Input, OnChanges } from '@angular/core';
import { User } from '@ygg/shared/user';
import { UserService } from '@ygg/shared/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-user-thumbnail',
  templateUrl: './user-thumbnail.component.html',
  styleUrls: ['./user-thumbnail.component.css']
})
export class UserThumbnailComponent implements OnChanges {
  @Input() id: string;
  user: User;
  subscription: Subscription;

  constructor(private userService: UserService) {}

  ngOnChanges() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.id) {
      this.subscription = this.userService
        .get$(this.id)
        .subscribe(user => (this.user = user));
    }
  }
}
