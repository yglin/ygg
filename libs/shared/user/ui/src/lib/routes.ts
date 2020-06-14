import { Routes } from '@angular/router';
import { InvitationFactoryService } from './invitation-factory.service';

export const routes: Routes = [
  {
    path: 'invite',
    children: [
      {
        path: ':id',
        resolve: {
          invitation: InvitationFactoryService
        }
      }
    ]
  }
];
