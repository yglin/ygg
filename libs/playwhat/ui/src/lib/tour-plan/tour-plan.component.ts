import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ImitationEvent,
  ImitationTourPlan,
  RelationshipScheduleEvent
} from '@ygg/playwhat/core';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { AuthorizeService } from '@ygg/shared/user/ui';
import {
  evalTotalChargeFromRelations,
  RelationPurchase
} from '@ygg/shopping/core';
import { TheThing, TheThingRelation } from '@ygg/the-thing/core';
import { get } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { TourPlanFactoryService } from '../tour-plan-factory.service';

@Component({
  selector: 'ygg-tour-plan',
  templateUrl: './tour-plan.component.html',
  styleUrls: ['./tour-plan.component.css']
})
export class TourPlanComponent implements OnInit, OnDestroy {
  readonly: boolean;
  tourPlan: TheThing;
  tourPlan$: Observable<TheThing>;
  imitation = ImitationTourPlan;
  subscriptions: Subscription[] = [];
  purchaseRelations: TheThingRelation[] = [];
  totalCharge: number = 0;
  eventIds: string[] = [];
  ImitationEvent = ImitationEvent;
  // actionSchedule = extend(ImitationTourPlan.actions['schedule'], {
  //   granted: false
  // });
  // actionSAR = extend(ImitationTourPlan.actions['send-approval-requests'], {
  //   granted: false
  // });

  constructor(
    private route: ActivatedRoute,
    private tourPlanFactory: TourPlanFactoryService,
    private authorizeService: AuthorizeService,
    private emcee: EmceeService
  ) {}

  reset() {
    this.purchaseRelations.length = 0;
    this.totalCharge = 0;
    this.eventIds.length = 0;
  }

  ngOnInit(): void {
    this.tourPlan$ = get(this.route.snapshot.data, 'tourPlan$', null);
    if (this.tourPlan$) {
      this.subscriptions.push(
        this.tourPlan$
          .pipe(
            filter(tourPlan => {
              this.reset();
              this.tourPlan = tourPlan;
              return !!tourPlan;
            }),
            tap(async tourPlan => {
              this.purchaseRelations = this.tourPlan.getRelations(
                RelationPurchase.name
              );
              this.totalCharge = await evalTotalChargeFromRelations(
                this.purchaseRelations
              );
              this.eventIds = this.tourPlan
                .getRelations(RelationshipScheduleEvent.name)
                .map(r => r.objectId);
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
    } else {
      this.emcee.error(`找不到遊程的資料來源`);
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  clearPurchases() {
    this.tourPlan.removeRelation(RelationPurchase.name);
    this.purchaseRelations.length = 0;
  }

  // runAction(action: TheThingAction) {
  //   this.theThingFactory.runAction(action, this.tourPlan);
  // }

  // importToCart() {
  //   this.tourPlanFactory.importToCart(this.tourPlan);
  // }
}
