import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Box } from '@ygg/ourbox/core';
import { EmceeService } from '@ygg/shared/ui/widgets';
// import { Box, BoxFactory, ImitationBox } from '@ygg/ourbox/core';
// import { EmceeService } from '@ygg/shared/ui/widgets';
import {
  AuthenticateUiService,
  NotificationFactoryService,
  UserService,
  UserFactoryService
} from '@ygg/shared/user/ui';
import { BoxFinderService } from './box-finder.service';
// import { TheThing } from '@ygg/the-thing/core';
// import {
//   RelationFactoryService,
//   TheThingAccessService,
//   TheThingFactoryService
// } from '@ygg/the-thing/ui';
// import { ItemAccessService } from '../item/item-access.service';
// import { ItemFactoryService } from '../item/item-factory.service';
// import { BoxFinderService } from './box-finder.service';

@Injectable({
  providedIn: 'root'
})
export class BoxResolverService implements Resolve<Box> {
  constructor(
    private authenticator: AuthenticateUiService,
    private boxFinder: BoxFinderService,
    private emcee: EmceeService,
    private router: Router
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Box> {
    const id = route.paramMap.get('id');
    try {
      await this.authenticator.requestLogin();
      const box = await this.boxFinder.findById(id);
      if (!box) {
        throw new Error(`找不到寶箱，id: ${id}`);
      }
      // const meMember = await this.isMember(id);
      // if (!meMember) {
      //   throw new Error(`非寶箱成員無法檢視寶箱 ${box.name} 的內容`);
      // }
      // console.dir(box);
      return box;
    } catch (error) {
      await this.emcee.error(`頁面載入失敗，錯誤原因：${error.message}`);
      this.router.navigate(['/']);
      return;
    }
  }
}
