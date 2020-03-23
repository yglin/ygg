import { Component, OnInit } from '@angular/core';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { TourPlanService } from '@ygg/playwhat/ui';
import { TourPlanAdminPageObject } from './tour-plan-admin.component.po';
import { IncomeRecord, ImitationOrder } from '@ygg/shopping/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { switchMap } from 'rxjs/operators';
import { TheThingAccessService } from '@ygg/the-thing/data-access';

@Component({
  selector: 'ygg-tour-plan-admin',
  templateUrl: './tour-plan-admin.component.html',
  styleUrls: ['./tour-plan-admin.component.css']
})
export class TourPlanAdminComponent implements OnInit {
  imitationTourPlan = ImitationTourPlan;
  // tourPlansByState$: { [stateName: string]: Observable<TheThing[]> } = {};
  tabNames = TourPlanAdminPageObject.TabNames;
  incomeRecords$: Observable<IncomeRecord[]>;
  dateRange$: BehaviorSubject<DateRange>;
  stateConfigs: {
    name: string;
    label: string;
    theThings$: Observable<TheThing[]>;
  }[] = [];

  constructor(
    private tourPlanService: TourPlanService,
    private theThingAccessService: TheThingAccessService
  ) {
    this.dateRange$ = new BehaviorSubject(DateRange.thisMonth());
    this.stateConfigs = ['applied', 'paid', 'completed'].map(name => {
      const filter = ImitationTourPlan.filter.clone();
      filter.addState(
        ImitationOrder.stateName,
        ImitationOrder.states[name].value
      );
      const stateConfig = {
        name,
        label: ImitationOrder.states[name].label,
        theThings$: this.dateRange$.pipe(
          switchMap(dateRange =>
            this.theThingAccessService.listByFilter$(filter)
          )
        )
      };
      return stateConfig;
    });
    this.incomeRecords$ = this.dateRange$.pipe(
      switchMap(dateRange => this.tourPlanService.listIncomeRecords$(dateRange))
    );
  }

  ngOnInit() {}
}
