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
import { Router } from '@angular/router';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { AlertType } from '@ygg/shared/infra/core';
import { ShoppingCartService } from '@ygg/shopping/ui';
import { Purchase, RelationNamePurchase } from '@ygg/shopping/core';

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
export class TourPlanFactoryService implements OnDestroy {
  tourPlan$: BehaviorSubject<TheThing> = new BehaviorSubject(null);
  tourPlan: TheThing;
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
        this.router.navigate(['/', 'tour-plans', 'create']);
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
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
    this.tourPlan = await this.theThingFactory.create({
      imitation: ImitationTourPlan.id
    });
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
    this.router.navigate(['/', 'the-things', this.tourPlan.id]);
    this.tourPlan = undefined;
    return;
  }
}
