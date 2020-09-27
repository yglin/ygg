import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { TheThing } from '@ygg/the-thing/core';
import { Observable, throwError } from 'rxjs';
import { first } from 'rxjs/operators';
import { ImitationFactoryService } from './imitation-factory.service';
import { TheThingAccessService } from './the-thing-access.service';
import { TheThingFactoryService } from './the-thing-factory.service';
import { TheThingSourceService } from './the-thing-source.service';

@Injectable({ providedIn: 'root' })
export class TheThingResolver implements Resolve<Observable<TheThing>> {
  constructor(
    private theThingSource: TheThingSourceService,
    private imitaionFactory: ImitationFactoryService,
    private emcee: EmceeService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Observable<TheThing>> {
    return new Promise(async (resolve, reject) => {
      try {
        const imitationId = route.paramMap.get('imitationId');
        if (!imitationId) {
          throw new Error(`Not found Imitation ID in route path`);
        }
        const id = route.paramMap.get('id');
        if (!id) {
          throw new Error(`Not found TheThing ID in route path`);
        }
        const imitation = await this.imitaionFactory.get(imitationId);
        resolve(this.theThingSource.load$(id, imitation.collection));
      } catch (error) {
        this.emcee.error(`<h3>載入頁面失敗，錯誤原因：\n${error.message}</h3>`);
        reject(error);
      }
    });
  }
}
