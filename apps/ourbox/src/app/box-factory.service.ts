import { Injectable } from '@angular/core';
import { BoxFactory } from '@ygg/ourbox/core';
import {
  AuthenticateService,
  InvitationFactoryService,
  UserService,
  AuthenticateUiService
} from '@ygg/shared/user/ui';
import { EmceeService } from '@ygg/shared/ui/widgets';
import {
  Router,
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { RelationFactoryService } from '@ygg/the-thing/ui';
import { BoxAccessService } from './box-access.service';
import { TheThing } from '@ygg/the-thing/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoxFactoryService extends BoxFactory implements Resolve<TheThing> {
  constructor(
    authenticator: AuthenticateUiService,
    emcee: EmceeService,
    invitationFactory: InvitationFactoryService,
    userAccessor: UserService,
    BoxAccessor: BoxAccessService,
    relationFactory: RelationFactoryService,
    router: Router
  ) {
    super(
      authenticator,
      emcee,
      invitationFactory,
      userAccessor,
      BoxAccessor,
      relationFactory,
      router
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
