import { Injectable } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Observable } from 'rxjs';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { ApplicationService } from './application.service';

@Injectable({
  providedIn: 'root'
})
export class TourPlanService {
  constructor(private applicationService: ApplicationService) {}

  listInApplication$(): Observable<TheThing[]> {
    const filter = ImitationTourPlan.filter.clone();
    return this.applicationService.listInApplication$(filter);
  }
}
