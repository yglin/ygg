import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TheThingFilter, TheThing } from '@ygg/the-thing/core';
import {
  TheThingImitationAccessService,
  TheThingAccessService
} from '@ygg/the-thing/data-access';
// import { take } from 'rxjs/operators';
import { TemplateTourPlan } from '@ygg/playwhat/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { isEmpty } from 'lodash';

@Component({
  selector: 'ygg-tour-plan-builder',
  templateUrl: './tour-plan-builder.component.html',
  styleUrls: ['./tour-plan-builder.component.css']
})
export class TourPlanBuilderComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  filterPlays: TheThingFilter;
  tourPlan: TheThing;

  constructor(
    private formBuilder: FormBuilder,
    private theThingAccessService: TheThingAccessService,
    private imitationAccessService: TheThingImitationAccessService
  ) {
    this.filterPlays = new TheThingFilter({
      name: '體驗',
      tags: ['體驗']
    });
    this.firstFormGroup = this.formBuilder.group({
      dateRange: [null, Validators.required],
      numParticipants: [null, Validators.required],
      selectedPlays: []
    });
    this.secondFormGroup = this.formBuilder.group({
      contact: [null, Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({});
  }

  ngOnInit() {}

  buildTourPlan() {
    const dateRange: DateRange = this.firstFormGroup.get('dateRange').value;
    this.tourPlan = TemplateTourPlan.clone();
    this.tourPlan.name = `深度遊趣${dateRange.days()}日遊`;
    this.tourPlan.cells['預計出遊日期'].value = dateRange;
    this.tourPlan.cells['預計參加人數'].value = this.firstFormGroup.get(
      'numParticipants'
    ).value;
    this.tourPlan.cells['聯絡資訊'].value = this.secondFormGroup.get(
      'contact'
    ).value;
    const selectedPlays = this.firstFormGroup.get('selectedPlays').value;
    if (!isEmpty(selectedPlays)) {
      this.tourPlan.addRelations('體驗', selectedPlays);
    }
  }

  async submitTourPlan() {
    if (confirm(`確定送出此遊程規劃？`)) {
      try {
        await this.theThingAccessService.upsert(this.tourPlan);
        alert(`已成功送出遊程規劃${this.tourPlan.name}`);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }

  isValidTourPlan(): boolean {
    return !!this.tourPlan;
  }
}
