import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { ImitationPlay } from '@ygg/playwhat/core';
import { AlertType } from '@ygg/shared/infra/core';
import { EmceeService } from '@ygg/shared/ui/widgets';
import {
  TheThing,
  TheThingAction,
  TheThingCell,
  TheThingImitation
} from '@ygg/the-thing/core';
import {
  TheThingAccessService,
  TheThingFactoryService
} from '@ygg/the-thing/ui';
import { extend, get } from 'lodash';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { EquipmentFactoryService } from './equipment-factory.service';

@Injectable({
  providedIn: 'root'
})
export class PlayFactoryService implements OnDestroy, Resolve<TheThing> {
  theThing$: BehaviorSubject<TheThing> = new BehaviorSubject(null);
  theThing: TheThing;
  cacheCreated: TheThing;
  subscriptions: Subscription[] = [];

  constructor(
    private theThingAccessor: TheThingAccessService,
    private theThingFactory: TheThingFactoryService,
    private emcee: EmceeService,
    private router: Router,
    private equipmentFactory: EquipmentFactoryService
  ) {
    theThingFactory.runAction$.subscribe(actionData => {
      const action = get(ImitationPlay.actions, actionData.action.id, null);
      if (!!action) {
        this.runAction(action, actionData.theThing);
      }
    });
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    if (id === 'create') {
      return this.create();
    } else if (id === 'edit') {
      return this.loadTheOne();
    } else if (!!id) {
      return this.load(id);
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  setMeta(value: { [key: string]: any }): void {
    extend(this.theThing, value);
  }

  async loadTheOne(): Promise<Observable<TheThing>> {
    if (!this.theThing) {
      this.theThing = await this.create();
    }
    this.theThing$.next(this.theThing);
    return this.theThing$;
  }

  async create(): Promise<TheThing> {
    if (!this.cacheCreated) {
      this.cacheCreated = await this.theThingFactory.create({
        imitationId: ImitationPlay.id
      });
    }
    this.theThing = this.cacheCreated;
    return this.cacheCreated;
  }

  setCell(cell: TheThingCell): void {
    this.theThing.upsertCell(cell);
    this.theThing$.next(this.theThing);
  }

  async load(id: string): Promise<TheThing> {
    return this.load$(id)
      .pipe(take(1))
      .toPromise();
  }

  load$(id: string): Observable<TheThing> {
    return this.theThingFactory
      .load$(id)
      .pipe(tap(theThing => (this.theThing = theThing)));
  }

  async save() {
    const confirm = await this.emcee.confirm(
      `確定要儲存 ${this.theThing.name} ？`
    );
    if (!confirm) {
      return;
    }
    await this.theThingFactory.save(this.theThing, {
      requireOwner: true
    });
    // if (
    //   ImitationTourPlan.isState(this.theThing, ImitationTourPlan.states.new)
    // ) {
    //   const confirm = await this.emcee.confirm(`順便將遊程計畫送出申請？`);
    //   if (confirm) {
    //     this.theThing.setState(
    //       ImitationTourPlan.stateName,
    //       ImitationTourPlan.states.applied
    //     );
    //     await this.theThingFactory.save(this.theThing, {
    //       requireOwner: true
    //     });
    //   }
    // }
    await this.emcee.alert(`已成功儲存 ${this.theThing.name}`, AlertType.Info);
    // this.theThing = undefined;
    if (!!this.cacheCreated && this.theThing.id === this.cacheCreated.id) {
      this.cacheCreated = undefined;
    }
    this.router.navigate(['/', ImitationPlay.routePath, this.theThing.id]);
    return;
  }

  deleteCell(cellId: string) {
    this.theThing.deleteCell(cellId);
  }

  async createRelationObject(imitation: TheThingImitation) {
    const currentUrl = this.router.url;
    // console.log(currentUrl);
    try {
      await this.equipmentFactory.createForRelation(this.theThing, imitation);
      this.router.navigateByUrl(currentUrl);
    } catch (error) {
      console.warn(error.message);
    }
  }

  async requestAssess(theThing: TheThing) {
    const confirm = await this.emcee.confirm(
      `送出 ${theThing.name} 給管理者審核？送出後資料便無法修改，審核成功即可上架販售`
    );
    if (confirm) {
      try {
        ImitationPlay.setState(theThing, ImitationPlay.states.assess);
        await this.theThingAccessor.upsert(theThing);
        this.emcee.info(`${theThing.name} 已送出，請等待管理者審核`);
      } catch (error) {
        this.emcee.error(`送出審核失敗，錯誤原因：${error.message}`);
      }
    }
  }

  async approveForSale(theThing: TheThing) {
    const confirm = await this.emcee.confirm(
      `體驗 ${theThing.name} 已通過審核，確定上架？`
    );
    if (confirm) {
      try {
        ImitationPlay.setState(theThing, ImitationPlay.states.forSale);
        await this.theThingAccessor.upsert(theThing);
        this.emcee.info(`體驗 ${theThing.name} 已上架`);
      } catch (error) {
        this.emcee.error(`送出審核失敗，錯誤原因：${error.message}`);
      }
    }
  }

  async backToEditing(theThing: TheThing) {
    const confirmMessage = `將體驗 ${theThing.name} 退回資料修改？${
      ImitationPlay.isState(theThing, ImitationPlay.states.forSale)
        ? '會一併下架體驗'
        : ''
    }`;
    const confirm = await this.emcee.confirm(confirmMessage);
    if (confirm) {
      try {
        ImitationPlay.setState(theThing, ImitationPlay.states.editing);
        await this.theThingAccessor.upsert(theThing);
        this.emcee.info(`體驗 ${theThing.name} 已退回資料修改狀態`);
      } catch (error) {
        this.emcee.error(`已退回資料修改失敗，錯誤原因：${error.message}`);
      }
    }
  }

  runAction(action: TheThingAction, theThing: TheThing) {
    switch (action.id) {
      case 'request-assess':
        this.requestAssess(theThing);
        break;
      case 'approve-for-sale':
        this.approveForSale(theThing);
        break;
      case 'back-to-editing':
        this.backToEditing(theThing);
        break;
      default:
        break;
    }
  }
}
