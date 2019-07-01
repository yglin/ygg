import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';
import { Observable, of } from 'rxjs';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { UserService, User } from '@ygg/shared/user';
import { switchMap } from 'rxjs/operators';
import { adminMenu } from './menu';

@Injectable({
  providedIn: 'root'
})
export class SchedulerAdminService {

  constructor(
    private dataAccessService: DataAccessService,
    private userService: UserService,
  ) { }

  async updateAgents(agentIds: string[]) {
    try {
      await this.dataAccessService.setDataObject(adminMenu.getPath('agent'), agentIds);
    } catch (error) {
      console.error(error);
    }
  }

  listAgentIds$(): Observable<string[]> {
    console.log(adminMenu.getPath('agent'));
    return this.dataAccessService.getDataObject$(adminMenu.getPath('agent'));
  }

  listAgentUsers$(): Observable<User[]> {
    return this.listAgentIds$().pipe(
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
