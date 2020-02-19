import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { TheThingFilter, TheThing, TheThingCell } from '@ygg/the-thing/core';
import {
  TheThingImitationAccessService,
  TheThingAccessService
} from '@ygg/the-thing/data-access';
// import { take } from 'rxjs/operators';
import { TemplateTourPlan, ImitationTourPlan, ImitationPlay } from '@ygg/playwhat/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { isEmpty, keyBy } from 'lodash';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'ygg-tour-plan-builder',
  templateUrl: './tour-plan-builder.component.html',
  styleUrls: ['./tour-plan-builder.component.css']
})
export class TourPlanBuilderComponent implements OnInit, OnDestroy {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  filterPlays: TheThingFilter;
  tourPlan: TheThing;
  tourPlan$: Subject<TheThing> = new Subject();
  formControlOptionalCells: FormControl;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private theThingAccessService: TheThingAccessService,
    private imitationAccessService: TheThingImitationAccessService
  ) {
    this.filterPlays = ImitationPlay.filter;
    this.firstFormGroup = this.formBuilder.group({
      dateRange: [null, Validators.required],
      numParticipants: [null, Validators.required],
      selectedPlays: []
    });
    this.secondFormGroup = this.formBuilder.group({
      contact: [null, Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({});

    const optionalCells: { [key: string]: TheThingCell } = keyBy(
      ImitationTourPlan.getOptionalCellDefs().map(cellDef =>
        TheThingCell.fromDef(cellDef)
      ),
      'name'
    );
    this.formControlOptionalCells = new FormControl(optionalCells);
    this.subscriptions.push(
      this.formControlOptionalCells.valueChanges.subscribe(
        (cells: { [key: string]: TheThingCell }) => {
          this.tourPlan.updateCells(cells);
          this.tourPlan$.next(this.tourPlan);
        }
      )
    );
    this.tourPlan = TemplateTourPlan.clone();
    this.tourPlan$.next(this.tourPlan);
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  updateTourPlan() {
    const dateRange: DateRange = this.firstFormGroup.get('dateRange').value;
    this.tourPlan.name = `深度遊趣${dateRange.days() + 1}日遊`;
    // this.tourPlan.name = `深度遊趣快樂遊`;
    this.tourPlan.cells['預計出遊日期'].value = dateRange;
    const numParticipants = this.firstFormGroup.get('numParticipants').value;
    this.tourPlan.cells['預計參加人數'].value = numParticipants;
    const contact = this.secondFormGroup.get('contact').value;
    this.tourPlan.cells['聯絡資訊'].value = contact;
    const selectedPlays = this.firstFormGroup.get('selectedPlays').value;
    if (!isEmpty(selectedPlays)) {
      this.tourPlan.addRelations('體驗', selectedPlays);
    }
    this.tourPlan$.next(this.tourPlan);
  }

  toFinalStep() {
    this.tourPlan$.next(this.tourPlan);
  }

  onTourPlanChanged(tourPlan: TheThing) {
    // console.log('Before theThingChanged');
    // console.dir(this.tourPlan.toJSON())
    // if (!!tourPlan) {
    //   this.tourPlan = tourPlan;
    //   console.log('After theThingChanged');
    //   console.dir(this.tourPlan.toJSON());
    //   this.tourPlan$.next(this.tourPlan);
    // }
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
