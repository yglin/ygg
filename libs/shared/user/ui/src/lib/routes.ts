import { Routes } from '@angular/router';
import { InvitationFactoryService } from './invitation-factory.service';
import { InvitationComponent } from './invitation/invitation/invitation.component';

export const routes: Routes = [
  {
    path: 'invite',
    children: [
      {
        path: ':id',
        component: InvitationComponent,
        resolve: {
          invitation: InvitationFactoryService
        }
      }
    ]
  }
];
