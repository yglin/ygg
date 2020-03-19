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
import { Subscription, Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';
import { ImitationTourPlan, ApplicationState } from '@ygg/playwhat/core';
import { pick, values } from 'lodash';
import { RelationNamePurchase } from '@ygg/shopping/core';
import { TourPlanService } from '../../tour-plan.service';
import { ApplicationService } from '../../application.service';

@Component({
  selector: 'ygg-tour-plan-view',
  templateUrl: './tour-plan-view.component.html',
  styleUrls: ['./tour-plan-view.component.css']
})
export class TourPlanViewComponent
  implements OnInit, OnChanges, OnDestroy, TheThingImitationViewInterface {
  @Input() theThing: TheThing;
  @Input() theThing$: Subject<TheThing>;
  // tourPlan: TheThing;
  // dateRange: DateRange;
  // dayTimeRange: DayTimeRange;
  // numParticipants: number;
  // contact: Contact;
  purchases: TheThingRelation[] = [];
  requiredCells: TheThingCell[] = [];
  optionalCells: TheThingCell[] = [];
  subscriptions: Subscription[] = [];
  canSubmitApplication = false;

  constructor(
    private theThingAccessService: TheThingAccessService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit() {
    if (!this.theThing$) {
      this.theThing$ = new Subject();
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
              this.purchases = this.theThing.getRelations(RelationNamePurchase);
              
              this.canSubmitApplication = !(this.theThing.getFlag(ApplicationState.InApplication));
            }, 0);
          })
        )
        .subscribe()
    );
    if (this.theThing) {
      this.theThing$.next(this.theThing);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.theThing$.next(this.theThing);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async submitApplication() {
    const confirmMessage = `將此遊程規劃送出申請？`;
    if (confirm(confirmMessage)) {
      try {
        await this.applicationService.submitApplication(this.theThing);
        alert(`遊程規劃已送出`);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }
}
