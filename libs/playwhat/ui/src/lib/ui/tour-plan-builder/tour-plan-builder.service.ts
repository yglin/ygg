import { Injectable } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingFactoryService } from '@ygg/the-thing/ui';
import { ImitationTourPlan } from '@ygg/playwhat/core';

@Injectable({
  providedIn: 'root'
})
export class TourPlanBuilderService {

  constructor(private theThingFactory: TheThingFactoryService) { }

  async create(): Promise<TheThing> {
    return this.theThingFactory.create({ imitation: ImitationTourPlan.id });
  }
}
