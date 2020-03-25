import { Component, OnInit } from '@angular/core';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { Observable } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { TourPlanAdminPageObject } from './tour-plan-admin.component.po';
import { IncomeRecord, ImitationOrder } from '@ygg/shopping/core';
import { AccountingService } from '@ygg/shopping/factory';
import { DateRange, Month } from '@ygg/shared/omni-types/core';
import { switchMap, startWith } from 'rxjs/operators';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { range } from 'lodash';
import { FormControl } from '@angular/forms';

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
  stateConfigs: {
    name: string;
    label: string;
    theThings$: Observable<TheThing[]>;
  }[] = [];
  months: Month[] = [];
  formControlSelectMonth: FormControl;

  constructor(
    private theThingAccessService: TheThingAccessService,
    private accountingService: AccountingService
  ) {
    this.months = range(12).map(offset => Month.fromMonthOffset(-offset));
    this.formControlSelectMonth = new FormControl(0);
    this.stateConfigs = ['applied', 'paid', 'completed'].map(name => {
      const filter = ImitationTourPlan.filter.clone();
      filter.addState(
        ImitationOrder.stateName,
        ImitationOrder.states[name].value
      );
      const stateConfig = {
        name,
        label: ImitationOrder.states[name].label,
        theThings$: this.formControlSelectMonth.valueChanges.pipe(
          startWith(0),
          switchMap((idx: number) => {
            const dateRange = this.months[idx];
            if (dateRange) {
              // console.log('Set new date range');
              // console.dir(dateRange);
              filter.setStateDateRange(dateRange);
            }
            return this.theThingAccessService.listByFilter$(filter);
          })
        )
      };
      return stateConfig;
    });
    this.incomeRecords$ = this.formControlSelectMonth.valueChanges.pipe(
      startWith(0),
      switchMap((idx: number) => {
        const dateRange = this.months[idx];
        const filter = ImitationTourPlan.filter.clone();
        if (dateRange) {
          filter.setStateDateRange(dateRange);
        }
        return this.accountingService.listIncomeRecords$(filter);
      })
    );
  }

  ngOnInit() {}
}
