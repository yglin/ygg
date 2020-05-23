import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
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
import { ShoppingCartService } from '@ygg/shopping/ui';
import { Purchase, RelationNamePurchase } from '@ygg/shopping/core';
import { take, tap } from 'rxjs/operators';

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
    private theThingFactory: TheThingFactoryService,
    private shoppingCart: ShoppingCartService,
    private emcee: EmceeService,
    private router: Router
  ) {
    // console.info('Subscribe to Shopping cart~!!!');
    this.subscriptions.push(
      this.shoppingCart.submit$.subscribe(async (purchases: Purchase[]) => {
        // console.info(
        //   '==================================== GOTU~ =================================='
        // );
        await this.loadTheOne();
        this.tourPlan.setRelation(
          RelationNamePurchase,
          purchases.map(p => p.toRelation())
        );
        this.router.navigate(['/', ImitationTourPlan.routePath, 'edit']);
      })
    );
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

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
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
    console.log('Create tour-plan');
    console.log(this.createInProgress);
    if (!this.createInProgress) {
      this.createInProgress = await this.theThingFactory.create({
        imitation: ImitationTourPlan.id
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
}
