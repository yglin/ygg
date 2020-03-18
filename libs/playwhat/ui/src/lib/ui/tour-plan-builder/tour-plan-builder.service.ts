import { Injectable } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingFactoryService } from '@ygg/the-thing/ui';
import { ImitationTourPlan } from '@ygg/playwhat/core';

@Injectable({
  providedIn: 'root'
})
export class TourPlanBuilderService {
  tourPlan: TheThing;

  constructor(private theThingFactory: TheThingFactoryService) {}

  reset() {
    this.tourPlan = undefined;
  }

  async create(): Promise<TheThing> {
    if (!this.tourPlan) {
      this.tourPlan = await this.theThingFactory.create({
        imitation: ImitationTourPlan.id
      });
    }
    return this.tourPlan;
  }
}
