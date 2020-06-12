import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TheThing, TheThingRelation } from '@ygg/the-thing/core';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { TourPlanFactoryService } from '../tour-plan-factory.service';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from '@ygg/shopping/ui';
import {
  RelationPurchase,
  Purchase,
  evalTotalChargeFromRelations
} from '@ygg/shopping/core';
import { switchMap, tap } from 'rxjs/operators';
import { AuthorizeService } from '@ygg/shared/user/ui';

@Component({
  selector: 'ygg-tour-plan',
  templateUrl: './tour-plan.component.html',
  styleUrls: ['./tour-plan.component.css']
})
export class TourPlanComponent implements OnInit, OnDestroy {
  readonly: boolean;
  tourPlan: TheThing;
  imitation = ImitationTourPlan;
  subscriptions: Subscription[] = [];
  purchaseRelations: TheThingRelation[] = [];
  totalCharge: number = 0;

  constructor(
    private tourPlanFactory: TourPlanFactoryService,
    private authorizeService: AuthorizeService,
    private shoppingCart: ShoppingCartService
  ) {
    this.subscriptions.push(
      this.tourPlanFactory.tourPlan$
        .pipe(
          tap(async tourPlan => {
            this.tourPlan = tourPlan;
            this.purchaseRelations = this.tourPlan.getRelations(
              RelationPurchase.name
            );
            this.totalCharge = await evalTotalChargeFromRelations(
              this.purchaseRelations
            );
          }),
          switchMap(tourPlan => this.authorizeService.canModify$(tourPlan)),
          tap(
            canModify =>
              (this.readonly = !(
                canModify && ImitationTourPlan.canModify(this.tourPlan)
              ))
          )
        )
        .subscribe()
    );
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  importToCart() {
    this.tourPlanFactory.importToCart(this.tourPlan);
  }
}
