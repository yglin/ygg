import { Component, OnInit, OnDestroy } from '@angular/core';
import { Notification } from '@ygg/shared/user/core';
import { NotificationFactoryService } from '../../notification-factory.service';
import { Subscription, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'ygg-my-notification-list',
  templateUrl: './my-notification-list.component.html',
  styleUrls: ['./my-notification-list.component.css']
})
export class MyNotificationListComponent implements OnInit, OnDestroy {
  unreadNotifications: Notification[] = [];
  readNotifications: Notification[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private notificationFactory: NotificationFactoryService,
    private router: Router
  ) {
    const unread$ = this.notificationFactory
      .getUnreadNotifications$()
      .pipe(tap(unreadList => (this.unreadNotifications = unreadList)));
    const read$ = this.notificationFactory
      .getReadNotifications$()
      .pipe(tap(readList => (this.readNotifications = readList)));
    this.subscription.add(merge(unread$, read$).subscribe());
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClickNotification(notification: Notification) {
    this.router.navigate(['/', 'notifications', notification.id]);
  }
}
