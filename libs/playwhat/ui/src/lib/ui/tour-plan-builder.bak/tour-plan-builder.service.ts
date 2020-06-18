import { Injectable } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingFactoryService } from '@ygg/the-thing/ui';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { AuthenticateUiService } from '@ygg/shared/user/ui';
import { ImitationOrder } from '@ygg/shopping/core';

@Injectable({
  providedIn: 'root'
})
export class TourPlanBuilderService {
  tourPlan: TheThing;

  constructor(
    private authUiService: AuthenticateUiService,
    private theThingAccessService: TheThingAccessService,
    private theThingFactory: TheThingFactoryService
  ) {}

  reset() {
    this.tourPlan = undefined;
  }

  async sendApplication(tourPlan: TheThing): Promise<TheThing> {
    tourPlan.setState(ImitationOrder.stateName, ImitationOrder.states.applied);
    return this.upsert(tourPlan);
  }

  async upsert(tourPlan: TheThing): Promise<TheThing> {
    try {
      const currentUser = await this.authUiService.requireLogin();
      tourPlan.ownerId = currentUser.id;
    } catch (error) {
      return Promise.reject(error);
    }
    try {
      const result = await this.theThingAccessService.upsert(tourPlan);
      alert(`已成功儲存遊程規劃${tourPlan.name}`);
      this.reset();
      return result;
    } catch (error) {
      alert(`儲存失敗，錯誤原因：${error.message}`);
      return Promise.reject(error);
    }
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
