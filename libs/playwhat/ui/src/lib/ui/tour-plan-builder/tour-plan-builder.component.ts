import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import {
  TheThingFilter,
  TheThing,
  TheThingCell,
  TheThingRelation
} from '@ygg/the-thing/core';
import {
  TheThingImitationAccessService,
  TheThingAccessService
} from '@ygg/the-thing/data-access';
// import { take } from 'rxjs/operators';
import {
  TemplateTourPlan,
  ImitationTourPlan,
  ImitationPlay
} from '@ygg/playwhat/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { isEmpty, keyBy, flatten, find, remove } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  Purchase,
  RelationNamePurchase,
  CellNameQuantity,
  CellNameCharge
} from '@ygg/shopping/core';
import { PurchaseService } from '@ygg/shopping/factory';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'ygg-tour-plan-builder',
  templateUrl: './tour-plan-builder.component.html',
  styleUrls: ['./tour-plan-builder.component.css']
})
export class TourPlanBuilderComponent implements OnInit, OnDestroy {
  isLinear = false;
  firstFormGroup: FormGroup;
  // formControlSelectedPlays: FormControl;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  filterPlays: TheThingFilter;
  tourPlan: TheThing;
  tourPlan$: Subject<TheThing> = new Subject();
  formControlOptionalCells: FormControl;
  purchases: Purchase[] = [];
  subscriptions: Subscription[] = [];
  formControlPurchases: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private theThingAccessService: TheThingAccessService,
    // private imitationAccessService: TheThingImitationAccessService,
    private purchaseService: PurchaseService,
    private router: Router
  ) {
    this.filterPlays = ImitationPlay.filter;
    this.firstFormGroup = this.formBuilder.group({
      dateRange: [null, Validators.required],
      numParticipants: [null, Validators.required]
    });
    this.formControlPurchases = new FormControl([]);
    // this.subscriptions.push(
    //   this.formControlPurchases.valueChanges
    //     .pipe(
    //       tap(purchases => {
    //         console.log('purchases change!!!');
    //         console.dir(purchases);
    //       })
    //     )
    //     .subscribe(purchases => (this.purchases = purchases))
    // );
    // this.formControlSelectedPlays = this.firstFormGroup.get(
    //   'selectedPlays'
    // ) as FormControl;
    // this.subscriptions.push(
    //   this.formControlSelectedPlays.valueChanges.subscribe(async plays => {
    //     this.purchases = [];
    //     const numParticipants = this.firstFormGroup.get('numParticipants')
    //       .value;
    //     if (!isEmpty(plays) && numParticipants > 0) {
    //       const purchases = await this.purchaseService.purchase(
    //         plays.map(play => play.id),
    //         numParticipants
    //       );
    //       this.formControlPurchases.setValue(purchases);
    //     }
    //   })
    // );

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

  async onSelectPlay(play: TheThing) {
    const purchases = this.formControlPurchases.value;
    const numParticipants = this.firstFormGroup.get('numParticipants').value;
    // console.log(`Quantity = ${numParticipants}`);
    const addPurchases = await this.purchaseService.purchase(
      play.id,
      numParticipants
    );
    this.formControlPurchases.setValue(purchases.concat(addPurchases));
    // console.dir(JSON.stringify(this.formControlPurchases.value));
  }

  async onDeselectPlay(play: TheThing) {
    const purchases: Purchase[] = this.formControlPurchases.value;
    const targetPurchase = find(purchases, p => p.productId === play.id);
    if (targetPurchase) {
      const removedPurchases: Purchase[] = this.purchaseService.removePurchase(
        targetPurchase
      );
      remove(purchases, p => find(removedPurchases, rp => rp.id === p.id));
      this.formControlPurchases.setValue(purchases);
    }
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
    // const selectedPlays = this.firstFormGroup.get('selectedPlays').value;
    // if (!isEmpty(selectedPlays)) {
    //   this.tourPlan.addRelations('體驗', selectedPlays);
    // }
    this.tourPlan.removeRelation(RelationNamePurchase);
    const purchases: Purchase[] = this.formControlPurchases.value;
    // console.dir(JSON.stringify(purchases));
    for (const purchase of purchases) {
      this.tourPlan.addRelation(RelationNamePurchase, purchase.productId, [
        new TheThingCell({
          name: CellNameQuantity,
          type: 'number',
          value: purchase.quantity
        }),
        new TheThingCell({
          name: CellNameCharge,
          type: 'number',
          value: purchase.charge
        })
      ]);
    }
    this.tourPlan$.next(this.tourPlan);
  }

  async toFinalStep() {
    await this.updateTourPlan();
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
        await this.updateTourPlan();
        await this.theThingAccessService.upsert(this.tourPlan);
        alert(`已成功送出遊程規劃${this.tourPlan.name}`);
        this.router.navigate(['/', 'the-things', this.tourPlan.id]);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }

  isValidTourPlan(): boolean {
    return !!this.tourPlan;
  }
}
