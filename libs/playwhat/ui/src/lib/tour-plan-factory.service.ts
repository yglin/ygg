import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import {
  TheThing,
  TheThingCell,
  TheThingState,
  TheThingAction
} from '@ygg/the-thing/core';
import { TheThingFactoryService } from '@ygg/the-thing/ui';
import {
  ImitationTourPlan,
  CellNames,
  defaultTourPlanName
} from '@ygg/playwhat/core';
import { set } from 'lodash';
import {
  Router,
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { AlertType } from '@ygg/shared/infra/core';
import { ShoppingCartService, CartSubmitPack } from '@ygg/shopping/ui';
import { Purchase, RelationPurchase } from '@ygg/shopping/core';
import { take, tap } from 'rxjs/operators';
import { TheThingAccessService } from '@ygg/the-thing/data-access';

export interface IModifyRequest {
  command: 'update' | 'add' | 'delete';
  target: 'meta' | 'cell';
  field: string;
  value?: any;
  emit?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TourPlanFactoryService implements OnDestroy, Resolve<TheThing> {
  tourPlan$: BehaviorSubject<TheThing> = new BehaviorSubject(null);
  tourPlan: TheThing;
  createInProgress: TheThing;
  subscriptions: Subscription[] = [];

  constructor(
    private theThingAccessor: TheThingAccessService,
    private theThingFactory: TheThingFactoryService,
    private shoppingCart: ShoppingCartService,
    private emcee: EmceeService,
    private router: Router
  ) {
    this.subscriptions.push(
      this.theThingFactory.runAction$.subscribe(actionSubmit => {
        for (const actionId in ImitationTourPlan.actions) {
          if (ImitationTourPlan.actions.hasOwnProperty(actionId)) {
            const action = ImitationTourPlan.actions[actionId];
            if (actionSubmit.action.id === action.id) {
              this.runAction(action, actionSubmit.theThing);
            }
          }
        }
      })
    );
    // console.info('Subscribe to Shopping cart~!!!');
    this.subscriptions.push(
      this.shoppingCart.submit$.subscribe(
        async (cartSubmit: CartSubmitPack) => {
          let tourPlan;
          if (!!cartSubmit.order) {
            tourPlan = cartSubmit.order;
          } else {
            tourPlan = await this.theThingFactory.create({
              imitationId: ImitationTourPlan.id
            });
          }
          tourPlan.setRelation(
            RelationPurchase.name,
            cartSubmit.purchases.map(p => p.toRelation())
          );
          this.router.navigate(['/', ImitationTourPlan.routePath, tourPlan.id]);
        }
      )
    );
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise(async (resolve, reject) => {
      try {
        const id = route.paramMap.get('id');
        if (id === 'create') {
          const newTourPlan = await this.theThingFactory.create({
            imitationId: ImitationTourPlan.id
          });
          this.router.navigate([
            '/',
            ImitationTourPlan.routePath,
            newTourPlan.id
          ]);
          this.tourPlan$.next(newTourPlan);
          resolve(newTourPlan);
        } else if (!!id) {
          this.theThingFactory.imitation = ImitationTourPlan;
          const tourPlan = await this.theThingFactory.load(id);
          this.tourPlan$.next(tourPlan);
          resolve(tourPlan);
        } else reject(new Error(`Require id in route path, got ${id}`));
      } catch (error) {
        console.error(error);
        this.emcee.error(`導向 ${route.url} 失敗，錯誤原因：${error.message}`);
        reject(error);
      }
    });
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  importToCart(tourPlan: TheThing) {
    const purchases = tourPlan
      .getRelations(RelationPurchase.name)
      .map(r => Purchase.fromRelation(r));
    this.shoppingCart.import(tourPlan, purchases);
  }

  async load(id: string): Promise<TheThing> {
    return this.load$(id)
      .pipe(take(1))
      .toPromise();
  }

  load$(id: string): Observable<TheThing> {
    return this.theThingFactory
      .load$(id)
      .pipe(tap(tourPlan => (this.tourPlan = tourPlan)));
  }

  async loadTheOne(): Promise<Observable<TheThing>> {
    // console.log('loadTheOne!!!');
    // console.log(this.tourPlan);
    if (!!this.tourPlan) {
      this.tourPlan$.next(this.tourPlan);
      return this.tourPlan$;
    } else {
      return this.create();
    }
  }

  async create(): Promise<Observable<TheThing>> {
    // console.log('Create tour-plan');
    // console.log(this.createInProgress);
    if (!this.createInProgress) {
      this.createInProgress = await this.theThingFactory.create({
        imitationId: ImitationTourPlan.id
      });
    }
    this.tourPlan = this.createInProgress;
    this.tourPlan$.next(this.tourPlan);
    return this.tourPlan$;
  }

  modify(request: IModifyRequest) {
    if (!this.tourPlan) {
      console.error(`The one tour-plan not exists`);
      return;
    }
    switch (request.target) {
      case 'meta':
        set(this.tourPlan, request.field, request.value);
        break;
      case 'cell':
        if (request.command === 'update') {
          if (this.tourPlan.hasCell(request.field)) {
            this.tourPlan.updateCellValue(request.field, request.value);
          }
        } else if (request.command === 'add') {
          this.tourPlan.addCell(request.value);
        } else if (request.command === 'delete') {
          this.tourPlan.deleteCell(request.field);
        }
        break;
      default:
        break;
    }
    // if (
    //   !this.tourPlan.name &&
    //   request.command === 'update' &&
    //   request.target === 'cell' &&
    //   request.field === CellNames.dateRange
    // ) {
    //   const dateRange = this.tourPlan.getCellValue(CellNames.dateRange);
    //   if (!!dateRange && !this.tourPlan.name) {
    //     this.tourPlan.name = defaultTourPlanName(dateRange);
    //   }
    //   this.tourPlan$.next(this.tourPlan);
    // }
    if (request.emit) {
      this.tourPlan$.next(this.tourPlan);
    }
  }

  async setState(state: TheThingState) {
    const confirm = await this.emcee.confirm(
      `要將 ${this.tourPlan.name} 的狀態設為 ${state.label}？`
    );
    if (confirm) {
      ImitationTourPlan.setState(this.tourPlan, state);
      await this.theThingFactory.save(this.tourPlan);
      this.tourPlan$.next(this.tourPlan);
    }
  }

  async save() {
    const confirm = await this.emcee.confirm(
      `確定要儲存 ${this.tourPlan.name} ？`
    );
    if (!confirm) {
      return;
    }
    await this.theThingFactory.save(this.tourPlan, {
      requireOwner: true
    });
    if (
      ImitationTourPlan.isState(this.tourPlan, ImitationTourPlan.states.new)
    ) {
      const confirm = await this.emcee.confirm(`順便將遊程計畫送出申請？`);
      if (confirm) {
        this.tourPlan.setState(
          ImitationTourPlan.stateName,
          ImitationTourPlan.states.applied
        );
        await this.theThingFactory.save(this.tourPlan, {
          requireOwner: true
        });
      }
    }
    await this.emcee.alert(`已成功儲存 ${this.tourPlan.name}`, AlertType.Info);
    // this.tourPlan = undefined;
    if (
      !!this.createInProgress &&
      this.tourPlan.id === this.createInProgress.id
    ) {
      this.createInProgress = undefined;
    }
    this.router.navigate(['/', ImitationTourPlan.routePath, this.tourPlan.id]);
    return;
  }

  async sendApplication(tourPlan: TheThing) {
    const confirm = await this.emcee.confirm(`將此遊程 ${tourPlan.name} 送出申請？一旦送出便無法再修改資料`);
    if (confirm) {
      ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.applied);
      await this.theThingAccessor.upsert(tourPlan);
      this.emcee.info(`遊程 ${tourPlan.name} 已送出申請，等待管理者審核。`);
    }
  }

  async cancelApplication(tourPlan: TheThing) {
    const confirm = await this.emcee.confirm(`取消此遊程 ${tourPlan.name} 的申請並退回修改狀態？`);
    if (confirm) {
      ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.editing);
      await this.theThingAccessor.upsert(tourPlan);
      this.emcee.info(`遊程 ${tourPlan.name} 已取消申請並退回修改`);
    }
  }

  async confirmPaid(tourPlan: TheThing) {
    const confirm = await this.emcee.confirm(
      `確定此遊程 ${tourPlan.name} 的所有款項已付清，標記為已付款？`
    );
    if (confirm) {
      ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.paid);
      await this.theThingAccessor.upsert(tourPlan);
      this.emcee.info(`遊程 ${tourPlan.name} 標記為已付款。`);
    }
  }

  async confirmCompleted(tourPlan: TheThing) {
    const confirm = await this.emcee.confirm(
      `確定此遊程 ${tourPlan.name} 的所有活動流程已結束，標記為已完成？`
    );
    if (confirm) {
      ImitationTourPlan.setState(tourPlan, ImitationTourPlan.states.completed);
      await this.theThingAccessor.upsert(tourPlan);
      this.emcee.info(`遊程 ${tourPlan.name} 標記為已完成。`);
    }
  }

  runAction(action: TheThingAction, tourPlan: TheThing) {
    try {
      switch (action.id) {
        case 'send-application':
          this.sendApplication(tourPlan);
          break;
        case 'cancel-application':
          this.cancelApplication(tourPlan);
          break;
        case 'confirm-paid':
          this.confirmPaid(tourPlan);
          break;
        case 'confirm-completed':
          this.confirmCompleted(tourPlan);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
      this.emcee.error(`執行失敗，錯誤原因：${error.message}`);
    }
  }
}
