import { Injectable } from '@angular/core';
import { EventFactory, ImitationEvent } from '@ygg/playwhat/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import {
  UserService,
  InvitationFactoryService,
  AuthenticateUiService
} from '@ygg/shared/user/ui';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TheThingFactoryService } from '@ygg/the-thing/ui';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { TheThing } from '@ygg/the-thing/core';

@Injectable({
  providedIn: 'root'
})
export class EventFactoryService extends EventFactory {
  constructor(
    theThingAccessor: TheThingAccessService,
    userAccessor: UserService,
    invitationFactory: InvitationFactoryService,
    authenticator: AuthenticateUiService,
    emcee: EmceeService,
    private theThingFactory: TheThingFactoryService
  ) {
    super(
      theThingAccessor,
      userAccessor,
      invitationFactory,
      authenticator,
      emcee
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
