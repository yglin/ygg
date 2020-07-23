import { Injectable } from '@angular/core';
import { EventFactory, ImitationEvent } from '@ygg/playwhat/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import {
  UserService,
  NotificationFactoryService,
  AuthenticateUiService
} from '@ygg/shared/user/ui';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  TheThingFactoryService,
  RelationFactoryService
} from '@ygg/the-thing/ui';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { TheThing } from '@ygg/the-thing/core';

@Injectable({
  providedIn: 'root'
})
export class EventFactoryService extends EventFactory {
  constructor(
    theThingAccessor: TheThingAccessService,
    theThingFactory: TheThingFactoryService,
    userAccessor: UserService,
    notificationFactory: NotificationFactoryService,
    authenticator: AuthenticateUiService,
    emcee: EmceeService,
    relationFactory: RelationFactoryService,
    router: Router
  ) {
    super(
      theThingAccessor,
      theThingFactory,
      userAccessor,
      notificationFactory,
      authenticator,
      emcee,
      relationFactory,
      router
    );
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<TheThing>> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = route.paramMap.get('id');
        if (!!id) {
          this.theThingFactory.imitation = ImitationEvent;
          // await this.theThingFactory.load(
          //   id,
          //   ImitationEvent.collection
          // );
          // this.event$ = this.theThingFactory.load$(id);
          // this.tourPlan$.next(tourPlan);
          resolve(this.theThingFactory.load$(id, ImitationEvent.collection));
        } else reject(new Error(`Require id in route path, got ${id}`));
      } catch (error) {
        console.error(error);
        this.emcee.error(`導向 ${route.url} 失敗，錯誤原因：${error.message}`);
        reject(error);
      }
    });
  }
}
