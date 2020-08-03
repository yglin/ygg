import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ImitationEvent,
  ImitationTourPlan,
  RelationshipScheduleEvent
} from '@ygg/playwhat/core';
import { AuthorizeService } from '@ygg/shared/user/ui';
import {
  evalTotalChargeFromRelations,
  RelationPurchase
} from '@ygg/shopping/core';
import { TheThing, TheThingRelation } from '@ygg/the-thing/core';
import { TheThingFactoryService } from '@ygg/the-thing/ui';
import { Subscription } from 'rxjs';
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
  imitation = ImitationTourPlan;
  subscriptions: Subscription[] = [];
  purchaseRelations: TheThingRelation[] = [];
  totalCharge: number = 0;
  eventIds: string[] = [];
  ImitationEvent = ImitationEvent;
  showThread = false;
  // actionSchedule = extend(ImitationTourPlan.actions['schedule'], {
  //   granted: false
  // });
  // actionSAR = extend(ImitationTourPlan.actions['send-approval-requests'], {
  //   granted: false
  // });

  constructor(
    private theThingFactory: TheThingFactoryService,
    private tourPlanFactory: TourPlanFactoryService,
    private authorizeService: AuthorizeService
  ) {
    this.subscriptions.push(
      this.tourPlanFactory.tourPlan$
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
            this.showThread = !ImitationTourPlan.isState(
              this.tourPlan,
              ImitationTourPlan.states.new
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
    // this.subscriptions.push(
    //   merge(
    //     ...[this.actionSchedule, this.actionSAR].map((action: any) =>
    //       this.theThingFactory
    //         .isActionGranted$(this.tourPlan.id, action, ImitationTourPlan)
    //         .pipe(tap(isGranted => (action.granted = isGranted)))
    //     )
    //   ).subscribe()
    // );
  }

  reset() {
    this.purchaseRelations.length = 0;
    this.totalCharge = 0;
    this.eventIds.length = 0;
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // runAction(action: TheThingAction) {
  //   this.theThingFactory.runAction(action, this.tourPlan);
  // }

  // importToCart() {
  //   this.tourPlanFactory.importToCart(this.tourPlan);
  // }
}
