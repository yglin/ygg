import { Injectable } from '@angular/core';
import { ItemFilter, ItemFactory } from '@ygg/ourbox/core';
import { Observable, of } from 'rxjs';
import { range, random } from 'lodash';
import { map, tap } from 'rxjs/operators';
import { EmceeService } from '@ygg/shared/ui/widgets';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { ItemAccessService } from './item-access.service';
import { TheThing, RelationAccessor } from '@ygg/the-thing/core';
import {
  TheThingFactoryService,
  RelationFactoryService
} from '@ygg/the-thing/ui';
import { UserService, AuthenticateUiService } from '@ygg/shared/user/ui';
import { TheThingAccessService } from '@ygg/the-thing/data-access';

@Injectable({
  providedIn: 'root'
})
export class ItemFactoryService extends ItemFactory
  implements Resolve<Observable<TheThing>> {
  constructor(
    emcee: EmceeService,
    router: Router,
    authenticator: AuthenticateUiService,
    // itemAccessor: ItemAccessService,
    theThingFactory: TheThingFactoryService,
    relationFactory: RelationFactoryService,
    userAccessor: UserService
  ) {
    super(
      emcee,
      router,
      authenticator,
      // itemAccessor,
      theThingFactory,
      relationFactory,
      userAccessor
    );
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<TheThing>> {
    const id = route.paramMap.get('id');
    try {
      // console.log(`Resolve item ${id}`);
      return this.load(id);
    } catch (error) {
      this.emcee.error(`找不到寶物，id = ${id}`);
      this.router.navigate(['/']);
      return;
    }
  }
}
