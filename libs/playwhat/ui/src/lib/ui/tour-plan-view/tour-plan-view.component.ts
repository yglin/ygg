import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { TheThing, TheThingCell, TheThingRelation } from '@ygg/the-thing/core';
import { DateRange, DayTimeRange, Contact } from '@ygg/shared/omni-types/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import {
  Subscription,
  Observable,
  BehaviorSubject,
  of,
  Subject,
  combineLatest
} from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';
import { ImitationTourPlan, ApplicationState } from '@ygg/playwhat/core';
import { pick, values, mapValues } from 'lodash';
import {
  RelationNamePurchase,
  Purchase,
  ImitationOrder
} from '@ygg/shopping/core';
import { AuthorizeService, AuthenticateService } from '@ygg/shared/user';

@Component({
  selector: 'ygg-tour-plan-view',
  templateUrl: './tour-plan-view.component.html',
  styleUrls: ['./tour-plan-view.component.css']
})
export class TourPlanViewComponent
  implements OnInit, OnDestroy, TheThingImitationViewInterface {
  @Input() theThing$: Observable<TheThing>;
  theThing: TheThing;
  // tourPlan: TheThing;
  // dateRange: DateRange;
  // dayTimeRange: DayTimeRange;
  // numParticipants: number;
  // contact: Contact;
  purchases: Purchase[] = [];
  requiredCells: TheThingCell[] = [];
  optionalCells: TheThingCell[] = [];
  subscriptions: Subscription[] = [];
  canSubmitApplication = false;
  isAdmin = false;
  state: number;
  stateLabel: string;
  states: { [key: string]: number } = {};
  canCancelApplied = false;

  constructor(
    private authorizeService: AuthorizeService,
    private theThingAccessService: TheThingAccessService
  ) {}

  ngOnInit() {
    if (!this.theThing$) {
      this.theThing$ = of(null);
    }
    this.subscriptions.push(
      this.theThing$
        .pipe(
          // tap(theThing => {
          //   console.log('Update tour plan view');
          //   console.dir(theThing.toJSON());
          // }),
          filter(theThing => !!theThing),
          tap(theThing => {
            // Force Angular to trigger change detection
            this.theThing = undefined;
            setTimeout(() => {
              this.theThing = theThing;
              // this.dateRange = theThing.getCellValue('預計出遊日期');
              // // this.dayTimeRange = this.tourPlan.cells['預計遊玩時間'].value;
              // this.numParticipants = theThing.getCellValue('預計參加人數');
              // // console.log(this.numParticipants);
              // this.contact = theThing.getCellValue('聯絡資訊');

              this.requiredCells = this.theThing.getCellsByNames(
                ImitationTourPlan.getRequiredCellNames()
              );
              this.optionalCells = this.theThing.getCellsByNames(
                ImitationTourPlan.getOptionalCellNames()
              );
              this.purchases = this.theThing
                .getRelations(RelationNamePurchase)
                .map(r => Purchase.fromRelation(r));

              this.state = this.theThing.getState(ImitationOrder.stateName);
              this.states = mapValues(ImitationOrder.states, s => s.value);
              this.stateLabel = ImitationTourPlan.getStateLabel(this.state);
              this.canCancelApplied =
                this.authorizeService.isOwner(this.theThing) &&
                this.theThing.isState(
                  ImitationOrder.stateName,
                  ImitationOrder.states.applied.value
                );
              this.canSubmitApplication = this.theThing.isState(
                ImitationOrder.stateName,
                ImitationOrder.states.new.value
              );
            }, 0);
          })
        )
        .subscribe()
    );
    this.subscriptions.push(
      this.authorizeService.isAdmin().subscribe(isAdmin => {
        this.isAdmin = isAdmin;
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async adminPaid() {
    const confirmMessage = `已確認此遊程所有款項已付款完成？`;
    if (confirm(confirmMessage)) {
      try {
        this.theThing.setState(
          ImitationOrder.stateName,
          ImitationOrder.states.paid
        );
        await this.theThingAccessService.upsert(this.theThing);
        alert(`此遊程已標記付款完成`);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }

  async adminComplete() {
    const confirmMessage = `已確認此遊程所有活動已全部跑完，額外商品也交付完成，可以進入帳務結算？`;
    if (confirm(confirmMessage)) {
      try {
        this.theThing.setState(
          ImitationOrder.stateName,
          ImitationOrder.states.completed
        );
        await this.theThingAccessService.upsert(this.theThing);
        alert(`此遊程已標記全部完成`);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }

  async submitApplication() {
    const confirmMessage = `將此遊程規劃送出申請？`;
    if (confirm(confirmMessage)) {
      try {
        this.theThing.setState(
          ImitationOrder.stateName,
          ImitationOrder.states.applied
        );
        await this.theThingAccessService.upsert(this.theThing);
        alert(`遊程規劃已送出`);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }

  async cancelApplied() {
    const confirmMessage = `取消此遊程規劃的申請？`;
    if (confirm(confirmMessage)) {
      try {
        this.theThing.setState(
          ImitationOrder.stateName,
          ImitationOrder.states.new
        );
        await this.theThingAccessService.upsert(this.theThing);
        alert(`已取消遊程規劃申請`);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }
}
