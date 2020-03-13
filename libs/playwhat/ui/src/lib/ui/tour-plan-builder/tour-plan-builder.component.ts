import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
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
  TheThingRelation,
  ITheThingEditorComponent
} from '@ygg/the-thing/core';
import {
  TheThingImitationAccessService,
  TheThingAccessService
} from '@ygg/the-thing/data-access';
// import { take } from 'rxjs/operators';
import { ImitationTourPlan, ImitationPlay } from '@ygg/playwhat/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { isEmpty, keyBy, flatten, find, remove } from 'lodash';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import {
  Purchase,
  RelationNamePurchase,
  CellNameQuantity,
  CellNameCharge
} from '@ygg/shopping/core';
import { PurchaseService } from '@ygg/shopping/factory';
import { tap } from 'rxjs/operators';
import { TourPlanBuilderService } from './tour-plan-builder.service';
import { AuthenticateService } from '@ygg/shared/user';

@Component({
  selector: 'ygg-tour-plan-builder',
  templateUrl: './tour-plan-builder.component.html',
  styleUrls: ['./tour-plan-builder.component.css']
})
export class TourPlanBuilderComponent
  implements OnInit, OnDestroy, ITheThingEditorComponent {
  isLinear = false;
  firstFormGroup: FormGroup;
  // formControlSelectedPlays: FormControl;
  secondFormGroup: FormGroup;
  forthFormGroup: FormGroup;
  filterPlays: TheThingFilter;
  @Input() theThing: TheThing;
  theThingPreview$: BehaviorSubject<TheThing> = new BehaviorSubject(null);
  purchases: Purchase[] = [];
  subscriptions: Subscription[] = [];
  formControlPurchases: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private theThingAccessService: TheThingAccessService,
    // private imitationAccessService: TheThingImitationAccessService,
    private purchaseService: PurchaseService,
    private router: Router,
    private theThingBuilder: TourPlanBuilderService,
    private authService: AuthenticateService
  ) {
    this.filterPlays = ImitationPlay.filter;
    this.firstFormGroup = this.formBuilder.group({
      dateRange: [null, Validators.required],
      numParticipants: [null, Validators.required]
    });
    this.formControlPurchases = new FormControl([]);

    this.secondFormGroup = this.formBuilder.group({
      contact: [null, Validators.required]
    });

    this.forthFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      optionalCells: keyBy(ImitationTourPlan.createOptionalCells(), 'name')
    });

    this.subscriptions.push(
      this.firstFormGroup.get('dateRange').valueChanges.subscribe(dateRange => {
        console.dir(dateRange.toJSON());
        console.log(dateRange.days());
        let name = this.forthFormGroup.get('name').value;
        if (!!dateRange && !name) {
          name = `深度遊趣${dateRange.days() + 1}日遊`;
          this.forthFormGroup.get('name').setValue(name);
        }
      })
    );
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

  ngOnInit() {
    if (!this.theThing) {
      this.theThingBuilder.create().then(newTourPlan => {
        this.theThing = newTourPlan;
        this.theThingPreview$.next(this.theThing);
      });
    } else {
      this.firstFormGroup.patchValue({
        dateRange: this.theThing.getCellValue('預計出遊日期'),
        numParticipants: this.theThing.getCellValue('預計參加人數')
      });
      this.secondFormGroup.patchValue({
        contact: this.theThing.getCellValue('聯絡資訊')
      });
      this.forthFormGroup.patchValue({
        name: this.theThing.name,
        optionalCells: keyBy(
          this.theThing.getCellsByNames(
            ImitationTourPlan.getOptionalCellNames()
          ),
          'name'
        )
      });
      // console.log('Convert relation to purchases');
      // console.dir(this.theThing.toJSON());
      if (this.theThing.hasRelation(RelationNamePurchase)) {
        const promisePurchases: Promise<Purchase[]>[] = [];
        for (const relation of this.theThing.getRelations(
          RelationNamePurchase
        )) {
          promisePurchases.push(
            this.purchaseService.purchase(
              relation.objectId,
              relation.getCellValue(CellNameQuantity)
            )
          );
        }
        Promise.all(promisePurchases).then(purchasesessessse => {
          this.purchases = flatten(purchasesessessse);
          // console.log('Converted purchases');
          // console.dir(this.purchases);
          this.formControlPurchases.setValue(this.purchases);
        });
      }
      this.theThingPreview$.next(this.theThing);
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //   //Add '${implements OnChanges}' to the class.
  //   console.log('ngonchange!!');
  //   console.dir(this.theThing);
  //   if (this.theThing) {
  //     this.firstFormGroup.patchValue({
  //       dateRange: this.theThing.getCellValue('預計出遊日期'),
  //       numParticipants: this.theThing.getCellValue('預計參加人數')
  //     });
  //   }
  //   this.theThingPreview$.next(this.theThing);
  // }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  updateTourPlan() {
    if (this.authService.currentUser) {
      this.theThing.ownerId = this.authService.currentUser.id;
    }
    const dateRange: DateRange = this.firstFormGroup.get('dateRange').value;
    // this.theThing.name = `深度遊趣快樂遊`;
    this.theThing.cells['預計出遊日期'].value = dateRange;
    const numParticipants = this.firstFormGroup.get('numParticipants').value;
    this.theThing.cells['預計參加人數'].value = numParticipants;
    const contact = this.secondFormGroup.get('contact').value;
    this.theThing.cells['聯絡資訊'].value = contact;
    // const selectedPlays = this.firstFormGroup.get('selectedPlays').value;
    // if (!isEmpty(selectedPlays)) {
    //   this.theThing.addRelations('體驗', selectedPlays);
    // }
    this.theThing.name = this.forthFormGroup.get('name').value;
    this.theThing.updateCells(this.forthFormGroup.get('optionalCells').value);

    this.theThing.removeRelation(RelationNamePurchase);
    const purchases: Purchase[] = this.formControlPurchases.value;
    // console.dir(JSON.stringify(purchases));
    for (const purchase of purchases) {
      this.theThing.addRelation(RelationNamePurchase, purchase.productId, [
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
    this.theThingPreview$.next(this.theThing);
  }

  toStepPreview() {
    this.updateTourPlan();
  }

  // onTourPlanChanged(theThing: TheThing) {
  // console.log('Before theThingChanged');
  // console.dir(this.theThing.toJSON())
  // if (!!theThing) {
  //   this.theThing = theThing;
  //   console.log('After theThingChanged');
  //   console.dir(this.theThing.toJSON());
  //   this.theThingPreview$.next(this.theThing);
  // }
  // }

  async submitTourPlan() {
    if (confirm(`確定送出此遊程規劃？`)) {
      try {
        await this.updateTourPlan();
        // console.dir(this.theThing.toJSON());
        await this.theThingAccessService.upsert(this.theThing);
        alert(`已成功送出遊程規劃${this.theThing.name}`);
        this.router.navigate(['/', 'the-things', this.theThing.id]);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }

  isValidTourPlan(): boolean {
    return !!this.theThing;
  }
}
