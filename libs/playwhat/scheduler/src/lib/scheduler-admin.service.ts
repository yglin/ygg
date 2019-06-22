import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';
import { Observable, of } from 'rxjs';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { UserService, User } from '@ygg/shared/user';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SchedulerAdminService {

  constructor(
    private dataAccessService: DataAccessService,
    private userService: UserService
  ) { }

  listAgentUsers$(): Observable<User[]> {
    return this.dataAccessService.getDataObject$('admin/users/roles/agents').pipe(
      switchMap((agentIds: string[]) => {
        if (isEmpty(agentIds)) {
          return of([]);
        } else {
          return this.userService.listByIds$(agentIds);
        }
      })
    );
  }
}
