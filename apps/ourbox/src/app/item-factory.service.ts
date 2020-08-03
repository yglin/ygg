import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { ItemFactory } from '@ygg/ourbox/core';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { AuthenticateUiService, UserService } from '@ygg/shared/user/ui';
import { TheThing } from '@ygg/the-thing/core';
import {
  RelationFactoryService,
  TheThingFactoryService
} from '@ygg/the-thing/ui';
import { Observable } from 'rxjs';

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
