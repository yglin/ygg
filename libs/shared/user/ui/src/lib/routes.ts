import { Routes } from '@angular/router';
import { NotificationFactoryService } from './notification-factory.service';
import { NotificationComponent } from './notification/notification/notification.component';
import { MyNotificationListComponent } from './notification/my-notification-list/my-notification-list.component';

export const routes: Routes = [
  {
    path: 'notifications',
    children: [
      {
        path: 'my',
        component: MyNotificationListComponent
      },
      {
        path: ':id',
        component: NotificationComponent,
        resolve: {
          notification: NotificationFactoryService
        }
      }
    ]
  }
];
