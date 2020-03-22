import { Component, OnInit } from '@angular/core';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { TourPlanService } from '@ygg/playwhat/ui';
import { TourPlanAdminPageObject } from './tour-plan-admin.component.po';
import { IncomeRecord } from '@ygg/shopping/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ygg-tour-plan-admin',
  templateUrl: './tour-plan-admin.component.html',
  styleUrls: ['./tour-plan-admin.component.css']
})
export class TourPlanAdminComponent implements OnInit {
  imitationTourPlan = ImitationTourPlan;
  tourPlans$: Observable<TheThing[]>;
  tabNames = TourPlanAdminPageObject.TabNames;
  incomeRecords$: Observable<IncomeRecord[]>;
  dateRange$: BehaviorSubject<DateRange>;

  constructor(private tourPlanService: TourPlanService) {
    this.tourPlans$ = this.tourPlanService.listInApplication$();
    this.dateRange$ = new BehaviorSubject(DateRange.thisMonth());
    this.incomeRecords$ = this.dateRange$.pipe(
      switchMap(dateRange => this.tourPlanService.listIncomeRecords$(dateRange))
    );
  }

  ngOnInit() {}
}
