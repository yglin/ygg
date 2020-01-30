import { Component, OnInit, Input } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { DateRange, DayTimeRange } from '@ygg/shared/omni-types/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';

@Component({
  selector: 'ygg-tour-plan-view',
  templateUrl: './tour-plan-view.component.html',
  styleUrls: ['./tour-plan-view.component.css']
})
export class TourPlanViewComponent
  implements OnInit, TheThingImitationViewInterface {
  @Input() theThing: TheThing;
  tourPlan: TheThing;
  dateRange: DateRange;
  dayTimeRange: DayTimeRange;
  numParticipants: number;

  constructor() {}

  ngOnInit() {
    if (this.theThing) {
      this.tourPlan = this.theThing;
    }
    if (this.tourPlan) {
      console.log(this.tourPlan);
      this.dateRange = this.tourPlan.cells['預計出遊日期'].value;
      this.dayTimeRange = this.tourPlan.cells['預計遊玩時間'].value;
      this.numParticipants = this.tourPlan.cells['預計參加人數'].value;
    }
  }
}
