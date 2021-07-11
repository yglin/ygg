import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Treasure } from '@ygg/ourbox/core';
import { wrapError } from '@ygg/shared/infra/error';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { Observable } from 'rxjs';
import { TreasureFactoryService } from '../treasure-factory.service';

@Injectable({
  providedIn: 'root'
})
export class TreasureCreateResolver implements Resolve<Treasure> {
  constructor(
    private emcee: EmceeService,
    private treasureFactory: TreasureFactoryService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Treasure> {
    try {
      const options: any = {};
      const boxId = route.queryParamMap.get('boxId');
      if (boxId) {
        options.boxId = boxId;
      }
      return this.treasureFactory.create(options);
    } catch (error) {
      const wrappedError = wrapError(error, `噗～～ 無法新增寶物，錯誤訊息：`);
      this.emcee.error(wrappedError.message);
      return Promise.reject(wrappedError);
    }
  }
}
