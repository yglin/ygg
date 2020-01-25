import { Component, OnInit, Input } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';

@Component({
  selector: 'ygg-tour-plan-view',
  templateUrl: './tour-plan-view.component.html',
  styleUrls: ['./tour-plan-view.component.css']
})
export class TourPlanViewComponent implements OnInit, TheThingImitationViewInterface {
  @Input() theThing: TheThing;
  tourPlan: TheThing;
  dateRange: DateRange;
  
  constructor() { }

  ngOnInit() {
    if (this.theThing) {
      this.tourPlan = this.theThing;
    }
    if (this.tourPlan) {
      this.dateRange = this.tourPlan.cells['預計出遊日期'].value;
    }
  }

}
