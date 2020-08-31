import { Injectable, OnDestroy } from '@angular/core';
import {
  Router,
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import {
  ItemTransferFactory,
  ImitationItemTransfer,
  ItemTransferCompleteInfo
} from '@ygg/ourbox/core';
import { EmceeService, YggDialogService } from '@ygg/shared/ui/widgets';
import {
  AuthenticateUiService,
  UserService,
  NotificationFactoryService
} from '@ygg/shared/user/ui';
import {
  RelationFactoryService,
  TheThingFactoryService
} from '@ygg/the-thing/ui';
import { ItemFactoryService } from '../item/item-factory.service';
import { Observable } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { ItemTransferCompleteComponent } from './item-transfer-complete/item-transfer-complete.component';

@Injectable({
  providedIn: 'root'
})
export class ItemTransferFactoryService extends ItemTransferFactory
  implements Resolve<Observable<TheThing>>, OnDestroy {
  constructor(
    emcee: EmceeService,
    router: Router,
    authenticator: AuthenticateUiService,
    itemFactory: ItemFactoryService,
    theThingFactory: TheThingFactoryService,
    relationFactory: RelationFactoryService,
    userAccessor: UserService,
    notificationFactory: NotificationFactoryService,
    protected dialog: YggDialogService
  ) {
    super(
      emcee,
      router,
      authenticator,
      itemFactory,
      theThingFactory,
      relationFactory,
      userAccessor,
      notificationFactory
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<TheThing>> {
    const id = route.paramMap.get('id');
    try {
      // console.log(`Resolve item-transfer ${id}`);
      return Promise.resolve(
        this.theThingFactory.load$(id, ImitationItemTransfer.collection)
      );
    } catch (error) {
      this.emcee.error(`找不到寶物交付紀錄，id = ${id}`);
      this.router.navigate(['/']);
      return;
    }
  }

  async inquireCompleteInfo(item: TheThing): Promise<ItemTransferCompleteInfo> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(ItemTransferCompleteComponent, {
        title: `確認已收到 ${item.name}`,
        data: {
          item
        }
      });
      dialogRef.afterClosed().subscribe(
        (result: ItemTransferCompleteInfo) => {
          resolve(result);
        },
        error => reject(error)
      );
    });
  }
}
