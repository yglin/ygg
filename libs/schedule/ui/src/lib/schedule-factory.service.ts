import { Injectable } from '@angular/core';
import { ScheduleFactory, Schedule } from '@ygg/schedule/core';
import {
  Router,
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { EmceeService } from '@ygg/shared/ui/widgets';

@Injectable({
  providedIn: 'root'
})
export class ScheduleFactoryService extends ScheduleFactory
  implements Resolve<Schedule> {
  constructor(router: Router, emcee: EmceeService) {
    super(router, emcee);
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Schedule> {
    const id = route.paramMap.get('id');
    if (!(id in this.schedulePool[id])) {
      await this.emcee.error(`找不到行程資料，id: ${id}`);
      this.router.navigate([]);
    }
    return this.schedulePool[id];
  }
}
