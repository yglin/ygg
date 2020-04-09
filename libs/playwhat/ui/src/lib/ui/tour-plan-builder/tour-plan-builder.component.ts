import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit
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
import {
  ImitationTourPlan,
  ImitationPlay,
  defaultTourPlanName
} from '@ygg/playwhat/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { isEmpty, keyBy, flatten, find, remove, get } from 'lodash';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import {
  Router,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import {
  Purchase,
  RelationNamePurchase,
  CellNameQuantity,
  CellNameCharge,
  ImitationOrder
} from '@ygg/shopping/core';
import { PurchaseService } from '@ygg/shopping/factory';
import { tap, first, map } from 'rxjs/operators';
import { TourPlanBuilderService } from './tour-plan-builder.service';
import {
  AuthenticateService,
  AuthenticateUiService
} from '@ygg/shared/user/ui';
import { MatStepper } from '@angular/material/stepper';
import { TheThingFactoryService } from '@ygg/the-thing/ui';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { PageStashService } from '@ygg/shared/infra/data-access';

@Component({
  selector: 'ygg-tour-plan-builder',
  templateUrl: './tour-plan-builder.component.html',
  styleUrls: ['./tour-plan-builder.component.css']
})
export class TourPlanBuilderComponent
  implements OnInit, OnDestroy, ITheThingEditorComponent {
  // @ViewChild('stepper', { static: false }) stepper: MatStepper;
  isLinear = false;
  firstFormGroup: FormGroup;
  // formControlSelectedPlays: FormControl;
  secondFormGroup: FormGroup;
  // forthFormGroup: FormGroup;
  filterPlays: TheThingFilter;
  @Input() theThing: TheThing;
  theThingPreview$: BehaviorSubject<TheThing> = new BehaviorSubject(null);
  purchases: Purchase[] = [];
  subscriptions: Subscription[] = [];
  // formControlPurchases: FormControl;
  imitation = ImitationTourPlan;
  stepIndex = 0;
  // stateData: any;

  constructor(
    private formBuilder: FormBuilder,
    private theThingAccessService: TheThingAccessService,
    private theThingFactory: TheThingFactoryService,
    // private imitationAccessService: TheThingImitationAccessService,
    private purchaseService: PurchaseService,
    private router: Router // private tourPlanBuilder: TourPlanBuilderService, // private authService: AuthenticateService, // private authUiService: AuthenticateUiService
  ) {
    this.filterPlays = ImitationPlay.filter;
    this.firstFormGroup = this.formBuilder.group({
      dateRange: [null, Validators.required],
      numParticipants: [null, Validators.required],
      selectedPlays: null
    });
    this.subscriptions.push(
      this.firstFormGroup
        .get('selectedPlays')
        .valueChanges.subscribe(async plays => {
          this.purchases = await this.purchaseSelectedPlays();
        })
    );
    // this.formControlPurchases = new FormControl([]);

    this.secondFormGroup = this.formBuilder.group({
      contact: [null, Validators.required]
    });

    // this.forthFormGroup = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   optionalCells: keyBy(ImitationTourPlan.createOptionalCells(), 'name')
    // });

    // this.subscriptions.push(
    //   this.firstFormGroup.get('dateRange').valueChanges.subscribe(dateRange => {
    //     let name = this.forthFormGroup.get('name').value;
    //     if (!!dateRange && !name) {
    //       name = `深度遊趣${dateRange.days() + 1}日遊`;
    //       this.forthFormGroup.get('name').setValue(name);
    //     }
    //   })
    // );
  }

  async purchaseSelectedPlays(): Promise<Purchase[]> {
    let purchases: Purchase[] = [];
    const quantity = this.firstFormGroup.get('numParticipants').value;
    const selectedPlays = this.firstFormGroup.get('selectedPlays').value || [];
    for (const play of selectedPlays) {
      try {
        const purchaseThePlay = await this.purchaseService.purchase(
          this.theThing,
          play,
          quantity
        );
        const newPurchases = this.purchaseService.listDescendantsIncludeMe(
          purchaseThePlay
        );
        purchases = purchases.concat(newPurchases);
      } catch (error) {
        alert(`購買 ${play.name} 失敗，錯誤原因：${error.message}`);
      }
    }
    // console.log('purchase selected plays');
    // console.dir(purchases);
    return purchases;
  }

  // async onSelectPlay(play: TheThing) {
  //   const purchases = this.formControlPurchases.value;
  //   const numParticipants = this.firstFormGroup.get('numParticipants').value;
  //   // console.log(`Quantity = ${numParticipants}`);
  //   try {
  //     const purchaseThePlay = await this.purchaseService.purchase(
  //       this.theThing,
  //       play,
  //       numParticipants
  //     );
  //     const newPurchases = this.purchaseService.listDescendantsIncludeMe(
  //       purchaseThePlay
  //     );
  //     this.formControlPurchases.setValue(purchases.concat(newPurchases));
  //   } catch (error) {}
  // }

  // async onDeselectPlay(play: TheThing) {
  //   const purchases: Purchase[] = this.formControlPurchases.value;
  //   const targetPurchase = find(purchases, p => p.productId === play.id);
  //   if (targetPurchase) {
  //     const removedPurchases: Purchase[] = this.purchaseService.removePurchases(
  //       targetPurchase
  //     );
  //     remove(purchases, p => find(removedPurchases, rp => rp.id === p.id));
  //     this.formControlPurchases.setValue(purchases);
  //   }
  // }

  async ngOnInit() {
    this.theThingFactory.setImitation(ImitationTourPlan);
    if (this.theThing) {
      this.theThingFactory.setSubjectThing(this.theThing);
    } else {
      this.theThing = this.theThingFactory.subjectThing;
    }
    if (!this.theThing) {
      this.theThing = await this.theThingFactory.create({
        imitation: ImitationTourPlan.id
      });
    }
    // this.theThingPreview$.next(this.theThing);
    // console.dir(this.theThing);
    this.populateTourPlan();
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // ngAfterViewInit() {}

  populateTourPlan() {
    this.firstFormGroup.patchValue({
      dateRange: this.theThing.getCellValue('預計出遊日期'),
      numParticipants: this.theThing.getCellValue('預計參加人數')
    });
    this.secondFormGroup.patchValue({
      contact: this.theThing.getCellValue('聯絡資訊')
    });
    if (this.firstFormGroup.valid) {
      this.stepIndex = 1;
      if (this.secondFormGroup.valid) {
        this.stepIndex = 2;
      }
    }
    // const optionalCells: TheThingCell[] = this.theThing.getCellsByNames(
    //   ImitationTourPlan.getOptionalCellNames()
    // );
    // console.dir(optionalCells);
    // this.forthFormGroup.patchValue({
    //   name: this.theThing.name,
    //   optionalCells: keyBy(optionalCells, 'name')
    // });
    // if (this.theThing.hasRelation(RelationNamePurchase)) {
    //   this.purchases = this.theThing
    //     .getRelations(RelationNamePurchase)
    //     .map(r => Purchase.fromRelation(r));
    //   this.theThingAccessService
    //     .listByIds$(this.theThing.getRelationObjectIds(RelationNamePurchase))
    //     .pipe(
    //       first(),
    //       map(products => {
    //         return products.filter(p => this.filterPlays.test(p));
    //       })
    //     )
    //     .toPromise()
    //     .then(plays => {
    //       this.firstFormGroup
    //         .get('selectedPlays')
    //         .setValue(plays, { emitEvent: false });
    //     });
    //   this.formControlPurchases.setValue(this.purchases);
    // }
    this.theThingPreview$.next(this.theThing);
  }

  async onStepChange(event: StepperSelectionEvent) {
    // console.log(this.stepper);
    // console.log(`Step ${this.stepper.selectedIndex}`);
    switch (event.previouslySelectedIndex) {
      case 0:
        const dateRange: DateRange = this.firstFormGroup.get('dateRange').value;
        const numParticipants = this.firstFormGroup.get('numParticipants')
          .value;
        this.theThing.updateCellValues({
          預計出遊日期: dateRange,
          預計參加人數: numParticipants
        });
        if (!this.theThing.name) {
          this.theThing.name = defaultTourPlanName(this.theThing);
        }
        this.theThing.setRelation(
          RelationNamePurchase,
          this.purchases.map(p => p.toRelation())
        );
        break;
      case 1:
        const contact = this.secondFormGroup.get('contact').value;
        this.theThing.cells['聯絡資訊'].value = contact;
        break;
      // case startIndex + 2:
      //   this.theThing.removeRelation(RelationNamePurchase);
      //   const purchases: Purchase[] = this.formControlPurchases.value;
      //   for (const purchase of purchases) {
      //     this.theThing.addRelation(purchase.toRelation());
      //   }
      //   break;
      // case startIndex + 3:
      //   this.theThing.name = this.forthFormGroup.get('name').value;
      //   this.theThing.updateCells(
      //     this.forthFormGroup.get('optionalCells').value
      //   );
      //   break;
      default:
        break;
    }
    this.theThingPreview$.next(this.theThing);
  }

  prevStep() {
    this.stepIndex = Math.max(0, this.stepIndex - 1);
  }

  // toStepPreview() {
  //   this.updateTourPlan();
  // }

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

  async save() {
    try {
      await this.theThingFactory.save({ requireOwner: true });
    } catch (error) {
      console.error(error.message);
    }
  }

  async submitTourPlan() {
    if (confirm(`確定儲存此遊程規劃？`)) {
      await this.save();
      this.router.navigate(['/', 'the-things', this.theThing.id]);
    }
  }

  async submitApplication() {
    if (confirm(`儲存此遊程規劃並且一併送出申請？`)) {
      this.theThing.setState(
        ImitationTourPlan.stateName,
        ImitationTourPlan.states.applied
      );
      await this.save();
      this.router.navigate(['/', 'the-things', this.theThing.id]);
    }
  }

  isValidTourPlan(): boolean {
    return !!this.theThing;
  }
}
