import {Component, Input, OnChanges} from '@angular/core';

import {User} from '@ygg/shared/user';
import {UserService} from '@ygg/shared/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnChanges {
  @Input() id: string;
  user: User;
  subscription: Subscription;

  constructor(private userService: UserService) {}

  ngOnChanges() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    if (this.id) {
      this.subscription = this.userService.get$(this.id).subscribe(user => this.user = user);
    }
  }
}
