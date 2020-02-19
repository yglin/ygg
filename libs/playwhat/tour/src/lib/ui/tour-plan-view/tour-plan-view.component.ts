import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { DateRange, DayTimeRange, Contact } from '@ygg/shared/omni-types/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { Subscription, Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { pick, values } from 'lodash';

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
  plays: TheThing[] = [];
  requiredCells: TheThingCell[] = [];
  optionalCells: TheThingCell[] = [];
  subscriptions: Subscription[] = [];

  constructor(private theThingAccessService: TheThingAccessService) {}

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
              // console.log(this.optionalCells);
            }, 0);
          }),
          switchMap(theThing => {
            if (theThing.hasRelation('體驗')) {
              return this.theThingAccessService.listByIds$(
                theThing.relations['體驗']
              );
            } else {
              return of([]);
            }
          })
        )
        .subscribe(plays => (this.plays = plays))
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
}
