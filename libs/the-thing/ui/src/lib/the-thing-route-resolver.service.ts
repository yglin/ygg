import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { TheThing, TheThingImitation } from '@ygg/the-thing/core';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { TheThingFactoryService } from './the-thing-factory.service';

@Injectable({
  providedIn: 'root'
})
export class TheThingRouteResolver implements Resolve<TheThing> {
  constructor(
    protected emcee: EmceeService,
    protected theThingFactory: TheThingFactoryService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const imitation: TheThingImitation = get(route.data, 'imitation');
    if (!imitation) {
      const error = new Error(
        `Failed to resolve the-thing, no imitation, route = ${route.url}`
      );
      this.emcee.error(error.message);
      return Promise.reject(error);
    }
    this.theThingFactory.launchCreation(imitation);
    return true;
  }
}
