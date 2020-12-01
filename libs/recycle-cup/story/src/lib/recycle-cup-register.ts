import { Emcee, Router } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { TheThingFactory } from '@ygg/the-thing/core';
import { ImitationRecycleCup } from '@ygg/recycle-cup/core';

export class RecycleCupRegister {
  constructor(
    protected router: Router,
    protected theThingFactory: TheThingFactory,
    protected emcee: Emcee
  ) {}

  async registerCups() {
    try {
      this.router.navigate([ImitationRecycleCup.id]);
      const newCup = await this.theThingFactory.create(ImitationRecycleCup);
      this.router.navigate([ImitationRecycleCup.id, newCup.id]);
    } catch (error) {
      const wError = wrapError(error, '無法註冊杯子，錯誤原因...');
      this.emcee.error(wError.message);
    }
  }
}
