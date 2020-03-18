import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
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
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'ygg-tour-plan-builder',
  templateUrl: './tour-plan-builder.component.html',
  styleUrls: ['./tour-plan-builder.component.css']
})
export class TourPlanBuilderComponent
  implements OnInit, OnDestroy, ITheThingEditorComponent {
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
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
    private tourPlanBuilder: TourPlanBuilderService,
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

  async ngOnInit() {
    if (!this.theThing) {
      this.theThing = await this.tourPlanBuilder.create();
    }
    this.theThingPreview$.next(this.theThing);
    this.populateTourPlan();
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  populateTourPlan() {
    this.firstFormGroup.patchValue({
      dateRange: this.theThing.getCellValue('預計出遊日期'),
      numParticipants: this.theThing.getCellValue('預計參加人數')
    });
    this.secondFormGroup.patchValue({
      contact: this.theThing.getCellValue('聯絡資訊')
    });
    const optionalCells: TheThingCell[] = this.theThing.getCellsByNames(
      ImitationTourPlan.getOptionalCellNames()
    );
    // console.dir(optionalCells);
    this.forthFormGroup.patchValue({
      name: this.theThing.name,
      optionalCells: keyBy(optionalCells, 'name')
    });
    if (this.theThing.hasRelation(RelationNamePurchase)) {
      const promisePurchases: Promise<Purchase[]>[] = [];
      for (const relation of this.theThing.getRelations(RelationNamePurchase)) {
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

  updateTourPlan() {
    if (this.authService.currentUser && !this.theThing.ownerId) {
      this.theThing.ownerId = this.authService.currentUser.id;
    }
    // console.log(this.stepper);
    if (!!this.stepper) {
      // console.log(`Step ${this.stepper.selectedIndex}`);
      const startIndex = 1;
      switch (this.stepper.selectedIndex) {
        case startIndex:
          const dateRange: DateRange = this.firstFormGroup.get('dateRange')
            .value;
          this.theThing.cells['預計出遊日期'].value = dateRange;
          const numParticipants = this.firstFormGroup.get('numParticipants')
            .value;
          this.theThing.cells['預計參加人數'].value = numParticipants;
          break;
        case startIndex + 1:
          const contact = this.secondFormGroup.get('contact').value;
          this.theThing.cells['聯絡資訊'].value = contact;
          break;
        case startIndex + 2:
          this.theThing.removeRelation(RelationNamePurchase);
          const purchases: Purchase[] = this.formControlPurchases.value;
          for (const purchase of purchases) {
            this.theThing.addRelation(
              RelationNamePurchase,
              purchase.productId,
              [
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
              ]
            );
          }
          break;
        case startIndex + 3:
          this.theThing.name = this.forthFormGroup.get('name').value;
          this.theThing.updateCells(
            this.forthFormGroup.get('optionalCells').value
          );
          break;
        default:
          break;
      }
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
        this.tourPlanBuilder.reset();
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
