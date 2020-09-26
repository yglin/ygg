import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { TheThingImitation } from '@ygg/the-thing/core';
import { Observable } from 'rxjs';
import { ImitationFactoryService } from './imitation-factory.service';

@Injectable({
  providedIn: 'root'
})
export class ImitationResolver implements Resolve<TheThingImitation> {
  constructor(
    protected imitationFactory: ImitationFactoryService,
    protected emcee: EmceeService,
    protected router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise(async (resolve, reject) => {
      try {
        const imitationId = route.paramMap.get('imitationId');
        const imitation: TheThingImitation = await this.imitationFactory.get(
          imitationId
        );
        resolve(imitation);
      } catch (error) {
        await this.emcee.error(`載入頁面失敗，錯誤原因：${error.message}`);
        this.router.navigate([]);
        reject(error);
      }
    });
  }
}
