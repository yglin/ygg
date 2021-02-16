import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Treasure } from '@ygg/ourbox/core';
import { EmceeService } from '@ygg/shared/ui/widgets';
// import { Treasure, TreasureFactory, ImitationTreasure } from '@ygg/ourtreasure/core';
// import { EmceeService } from '@ygg/shared/ui/widgets';
import {
  AuthenticateUiService
} from '@ygg/shared/user/ui';
import { TreasureFinderService } from './treasure-finder.service';
// import { TheThing } from '@ygg/the-thing/core';
// import {
//   RelationFactoryService,
//   TheThingAccessService,
//   TheThingFactoryService
// } from '@ygg/the-thing/ui';
// import { ItemAccessService } from '../item/item-access.service';
// import { ItemFactoryService } from '../item/item-factory.service';
// import { TreasureFinderService } from './treasure-finder.service';

@Injectable({
  providedIn: 'root'
})
export class TreasureResolverService implements Resolve<Treasure> {
  constructor(
    private authenticator: AuthenticateUiService,
    private treasureFinder: TreasureFinderService,
    private emcee: EmceeService,
    private router: Router
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Treasure> {
    const id = route.paramMap.get('id');
    try {
      const treasure = await this.treasureFinder.findById(id);
      if (!treasure) {
        throw new Error(`找不到寶物，id: ${id}`);
      }
      // const meMember = await this.isMember(id);
      // if (!meMember) {
      //   throw new Error(`非寶箱成員無法檢視寶箱 ${treasure.name} 的內容`);
      // }
      // console.dir(treasure);
      return treasure;
    } catch (error) {
      await this.emcee.error(`頁面載入失敗，錯誤原因：${error.message}`);
      this.router.navigate(['/']);
      return;
    }
  }
}
