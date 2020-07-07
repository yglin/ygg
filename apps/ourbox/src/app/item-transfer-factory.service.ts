import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { ItemTransferFactory, ImitationItemTransfer } from '@ygg/ourbox/core';
import { EmceeService } from '@ygg/shared/ui/widgets';
import {
  AuthenticateUiService,
  UserService,
  InvitationFactoryService
} from '@ygg/shared/user/ui';
import {
  RelationFactoryService,
  TheThingFactoryService
} from '@ygg/the-thing/ui';
import { ItemFactoryService } from './item-factory.service';
import { Observable } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';

@Injectable({
  providedIn: 'root'
})
export class ItemTransferFactoryService extends ItemTransferFactory
  implements Resolve<Observable<TheThing>> {
  constructor(
    emcee: EmceeService,
    router: Router,
    authenticator: AuthenticateUiService,
    itemFactory: ItemFactoryService,
    theThingFactory: TheThingFactoryService,
    relationFactory: RelationFactoryService,
    userAccessor: UserService,
    invitationFactory: InvitationFactoryService
  ) {
    super(
      emcee,
      router,
      authenticator,
      itemFactory,
      theThingFactory,
      relationFactory,
      userAccessor,
      invitationFactory
    );
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<TheThing>> {
    const id = route.paramMap.get('id');
    try {
      // console.log(`Resolve item ${id}`);
      return Promise.resolve(
        this.theThingFactory.load$(id, ImitationItemTransfer.collection)
      );
    } catch (error) {
      this.emcee.error(`找不到寶物交付紀錄，id = ${id}`);
      this.router.navigate(['/']);
      return;
    }
  }
}
