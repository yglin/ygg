import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, Resolve, Router,


  RouterStateSnapshot
} from '@angular/router';
import { BoxFactory, ItemFilter } from '@ygg/ourbox/core';
import { EmceeService } from '@ygg/shared/ui/widgets';
import {
  AuthenticateUiService, InvitationFactoryService,
  UserService
} from '@ygg/shared/user/ui';
import { TheThing } from '@ygg/the-thing/core';
import { RelationFactoryService } from '@ygg/the-thing/ui';
import { Observable } from 'rxjs';
import { BoxAccessService } from './box-access.service';
import { ItemAccessService } from './item-access.service';
import { ItemFactoryService } from './item-factory.service';

@Injectable({
  providedIn: 'root'
})
export class BoxFactoryService extends BoxFactory implements Resolve<TheThing> {
  findItemsOnMap(filter: ItemFilter): any {
    throw new Error("Method not implemented.");
  }
  constructor(
    authenticator: AuthenticateUiService,
    emcee: EmceeService,
    invitationFactory: InvitationFactoryService,
    userAccessor: UserService,
    BoxAccessor: BoxAccessService,
    relationFactory: RelationFactoryService,
    router: Router,
    itemFactory: ItemFactoryService,
    itemAccessor: ItemAccessService
  ) {
    super(
      authenticator,
      emcee,
      invitationFactory,
      userAccessor,
      BoxAccessor,
      relationFactory,
      router,
      itemFactory,
      itemAccessor
    );
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): TheThing | Observable<TheThing> | Promise<TheThing> {
    const id = route.paramMap.get('id');
    try {
      return this.boxAccessor.load(id);
    } catch (error) {
      this.emcee.error(`找不到寶箱，id = ${id}`);
      this.router.navigate(['/']);
      return;
    }
  }
}
