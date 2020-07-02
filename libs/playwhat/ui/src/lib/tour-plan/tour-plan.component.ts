import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  TheThing,
  TheThingRelation,
  TheThingAction
} from '@ygg/the-thing/core';
import {
  ImitationTourPlan,
  ImitationEvent,
  RelationshipScheduleEvent
} from '@ygg/playwhat/core';
import { TourPlanFactoryService } from '../tour-plan-factory.service';
import { Subscription, of } from 'rxjs';
import { ShoppingCartService } from '@ygg/shopping/ui';
import {
  RelationPurchase,
  Purchase,
  evalTotalChargeFromRelations
} from '@ygg/shopping/core';
import { switchMap, tap, filter } from 'rxjs/operators';
import { AuthorizeService } from '@ygg/shared/user/ui';
import { isEmpty, find } from 'lodash';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { TheThingFactoryService } from '@ygg/the-thing/ui';

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
  canSchedule = false;
  actionSchedule = ImitationTourPlan.actions['schedule'];
  canSendApprovalRequests = false;
  actionSAR = ImitationTourPlan.actions['send-approval-requests'];

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
    this.subscriptions.push(
      this.theThingFactory
        .getPermittedActions$(this.tourPlanFactory.tourPlan$, ImitationTourPlan)
        .subscribe((actions: TheThingAction[]) => {
          this.canSchedule = !!find(
            actions,
            action => action.id === this.actionSchedule.id
          );
          this.canSendApprovalRequests = !!find(
            actions,
            action => (action.id === this.actionSAR.id)
          );
        })
    );
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

  runAction(action: TheThingAction) {
    this.theThingFactory.runAction(action, this.tourPlan);
  }

  importToCart() {
    this.tourPlanFactory.importToCart(this.tourPlan);
  }
}
