import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { DateRange, DayTimeRange, Contact } from '@ygg/shared/omni-types/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'ygg-tour-plan-view',
  templateUrl: './tour-plan-view.component.html',
  styleUrls: ['./tour-plan-view.component.css']
})
export class TourPlanViewComponent
  implements OnInit, OnChanges, OnDestroy, TheThingImitationViewInterface {
  @Input() theThing: TheThing;
  theThing$: BehaviorSubject<TheThing> = new BehaviorSubject(null);
  // tourPlan: TheThing;
  dateRange: DateRange;
  dayTimeRange: DayTimeRange;
  numParticipants: number;
  contact: Contact;
  plays: TheThing[] = [];
  subscriptions: Subscription[] = [];

  constructor(private theThingAccessService: TheThingAccessService) {
    this.subscriptions.push(this.theThing$.pipe(
      filter(theThing => !!theThing),
      tap(theThing => {
          // this.theThing = theThing;
          this.dateRange = theThing.getCellValue('預計出遊日期');
          // this.dayTimeRange = this.tourPlan.cells['預計遊玩時間'].value;
          this.numParticipants = theThing.getCellValue('預計參加人數');
          // console.log(this.numParticipants);
          this.contact = theThing.getCellValue('聯絡資訊');
      }),
      switchMap(theThing => {
        if (theThing.hasRelation('體驗')) {
          return this.theThingAccessService.listByIds$(theThing.relations['體驗'])
        } else {
          return of([]);
        }
      })
    ).subscribe(plays => this.plays = plays));
  }

  ngOnInit() {
    this.theThing$.next(this.theThing);
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
