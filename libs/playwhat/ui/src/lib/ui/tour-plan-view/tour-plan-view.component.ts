import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  CellNames,
  defaultTourPlanName,
  ImitationPlay,
  ImitationTourPlan
} from '@ygg/playwhat/core';
import { AlertType } from '@ygg/shared/infra/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { PageResolverService } from '@ygg/shared/ui/navigation';
import { EmceeService, YggDialogService } from '@ygg/shared/ui/widgets';
import { AuthorizeService } from '@ygg/shared/user/ui';
import {
  evalTotalChargeFromRelations,
  ImitationOrder,
  Purchase,
  RelationPurchase
} from '@ygg/shopping/core';
import { IInputShoppingCart, ShoppingCartService } from '@ygg/shopping/ui';
import {
  TheThing,
  TheThingCell,
  TheThingRelation,
  TheThingState,
  TheThingImitation
} from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import {
  CellCreatorComponent,
  TheThingImitationViewInterface
} from '@ygg/the-thing/ui';
import { find, get, isEmpty, mapValues, values } from 'lodash';
import { merge, Observable, of, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import {
  IModifyRequest,
  TourPlanFactoryService
} from '../../tour-plan-factory.service';

@Component({
  selector: 'ygg-tour-plan-view',
  templateUrl: './tour-plan-view.component.html',
  styleUrls: ['./tour-plan-view.component.css']
})
export class TourPlanViewComponent
  implements OnInit, OnDestroy, TheThingImitationViewInterface {
  @Input() theThing$: Observable<TheThing>;
  theThing: TheThing;
  @Input() readonly: boolean;
  // tourPlan: TheThing;
  // dateRange: DateRange;
  // dayTimeRange: DayTimeRange;
  // numParticipants: number;
  // contact: Contact;
  imitation: TheThingImitation = ImitationTourPlan;
  purchaseRelations: TheThingRelation[] = [];
  requiredCells: TheThingCell[] = [];
  otherCells: TheThingCell[] = [];
  subscriptions: Subscription[] = [];
  canSubmitApplication = false;
  isAdmin = false;
  // isOwner = false;
  state: TheThingState;
  // stateLabel: string;
  // states: { [key: string]: number } = {};
  canCancelApplied = false;
  formGroup: FormGroup;
  nameStyle = {
    'font-size': '24px',
    'text-shadow': '3px 3px 3px #FDFFC7'
  };
  totalCharge: number = 0;

  constructor(
    private authorizeService: AuthorizeService,
    private theThingAccessService: TheThingAccessService,
    private tourPlanFactory: TourPlanFactoryService,
    private pageResolver: PageResolverService,
    private router: Router,
    private dialog: YggDialogService,
    private emcee: EmceeService,
    private formBuilder: FormBuilder,
    private shoppingCart: ShoppingCartService
  ) {
    const controlsConfig: { [key: string]: any } = {
      name: [null, Validators.required]
    };
    this.requiredCells = ImitationTourPlan.getRequiredCellDefs().map(cellDef =>
      cellDef.createCell()
    );
    for (const cell of this.requiredCells) {
      controlsConfig[cell.name] = new FormControl(null, [Validators.required]);
    }
    this.formGroup = formBuilder.group(controlsConfig);
    // console.dir(this.formGroup.controls);

    this.subscriptions.push(
      this.formGroup.get('name').valueChanges.subscribe(value => {
        const modifyCommand: IModifyRequest = {
          command: 'update',
          target: 'meta',
          field: 'name',
          value
        };
        this.tourPlanFactory.modify(modifyCommand);
      })
    );
    for (const cell of this.requiredCells) {
      this.subscriptions.push(
        this.formGroup.get(cell.name).valueChanges.subscribe(value => {
          const modifyCommand: IModifyRequest = {
            command: 'update',
            target: 'cell',
            field: cell.name,
            value
          };
          this.tourPlanFactory.modify(modifyCommand);
        })
      );
    }

    const formControlDateRange = this.formGroup.get(CellNames.dateRange);
    const formControlName = this.formGroup.get('name');
    this.subscriptions.push(
      formControlDateRange.valueChanges.subscribe(value => {
        if (DateRange.isDateRange(value) && !formControlName.value) {
          formControlName.setValue(defaultTourPlanName(value));
        }
      })
    );
  }

  async ngOnInit() {
    // console.log('Tour View Init~!!!');
    this.readonly = this.readonly !== undefined && this.readonly !== false;
    // console.log(this.readonly);
    if (!this.theThing$) {
      if (!!this.theThing) {
        this.theThing$ = of(this.theThing);
      } else {
        this.theThing$ = await this.tourPlanFactory.loadTheOne();
      }
    }
    const theThingUpdate$ = this.theThing$.pipe(
      filter(theThing => !!theThing),
      tap(theThing => {
        this.theThing = theThing;
        console.log('update from factory');
        console.log(this.theThing);

        // console.info(this.theThing);
        this.purchaseRelations = this.theThing.getRelations(
          RelationPurchase.name
        );

        this.formGroup.get('name').setValue(this.theThing.name, {
          emitEvent: false
        });

        for (const cellName in this.theThing.cells) {
          if (this.theThing.cells.hasOwnProperty(cellName)) {
            const cell = this.theThing.cells[cellName];
            const control = this.formGroup.get(cell.name);
            if (!control) {
              this.addCellControl(cell);
            } else {
              control.setValue(cell.value, { emitEvents: false });
            }
          }
        }

        this.otherCells = ImitationTourPlan.pickNonRequiredCells(
          values(this.theThing.cells)
        );

        for (const controlName in this.formGroup.controls) {
          if (this.formGroup.controls.hasOwnProperty(controlName)) {
            if (
              controlName !== 'name' &&
              !find(this.requiredCells, c => c.name === controlName) &&
              !find(this.otherCells, c => c.name === controlName)
            ) {
              this.formGroup.removeControl(controlName);
            }
          }
        }

        // for (const cell of this.otherCells) {
        //   this.addCellControl(cell);
        // }

        // this.purchases = this.theThing
        //   .getRelations(RelationPurchase.name)
        //   .map(r => Purchase.fromRelation(r));

        // this.isOwner = this.authorizeService.isOwner(this.theThing);
        this.readonly =
          this.readonly || !this.authorizeService.canModify(this.theThing);
        // console.log(this.readonly);

        this.state = this.imitation.getState(this.theThing);
        console.log(this.state);
        // this.states = mapValues(ImitationOrder.states, s => s.value);
        // this.stateLabel = ImitationTourPlan.getStateLabel(this.state);
        this.canCancelApplied =
          this.authorizeService.isOwner(this.theThing) &&
          this.isState(this.imitation.states.applied);
        this.canSubmitApplication =
          this.authorizeService.isOwner(this.theThing) &&
          this.isState(this.imitation.states.new);
      }),
      tap(async () => {
        this.totalCharge = await evalTotalChargeFromRelations(
          this.purchaseRelations
        );
      })
    );
    const isAdmin$ = this.authorizeService.isAdmin().pipe(
      tap(isAdmin => {
        this.isAdmin = isAdmin;
      })
    );
    this.subscriptions.push(merge(theThingUpdate$, isAdmin$).subscribe());
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  updateFromPageResolver(theThing: TheThing) {
    // const purchases = get(this.stateData, 'purchases', []);
    let purchases: Purchase[] = [];
    let cells: TheThingCell[] = [];
    if (this.pageResolver.isResolved()) {
      const outputData = get(this.pageResolver.pop(), 'output', null);
      purchases = get(outputData, 'purchases', []);
      cells = get(outputData, 'cells', []);
    }
    if (!isEmpty(cells)) {
      theThing.addCells(cells);
    }
    if (!isEmpty(purchases)) {
      theThing.setRelation(
        RelationPurchase.name,
        purchases.map(p => p.toRelation())
      );
    }
  }

  gotoEditOptionalCells() {
    const optionalCells = ImitationTourPlan.createOptionalCells();
    this.pageResolver.to('/the-things/cells/edit', {
      cells: optionalCells,
      imitation: ImitationTourPlan
    });
  }

  gotoEditPurchases() {
    const purchases: Purchase[] = this.theThing
      .getRelations(RelationPurchase.name)
      .map(r => Purchase.fromRelation(r));
    // console.log(purchases);

    const inputs: IInputShoppingCart = {
      purchases,
      productFilter: ImitationPlay.filter,
      consumer: this.theThing
    };
    this.pageResolver.to('/shopping/cart', inputs);
  }

  async adminPaid() {
    const confirmMessage = `已確認此遊程所有款項已付款完成？`;
    if (confirm(confirmMessage)) {
      try {
        this.theThing.setState(
          ImitationOrder.stateName,
          ImitationOrder.states.paid
        );
        await this.theThingAccessService.upsert(this.theThing);
        alert(`此遊程已標記付款完成`);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }

  async adminComplete() {
    const confirmMessage = `已確認此遊程所有活動已全部跑完，額外商品也交付完成，可以進入帳務結算？`;
    if (confirm(confirmMessage)) {
      try {
        this.theThing.setState(
          ImitationOrder.stateName,
          ImitationOrder.states.completed
        );
        await this.theThingAccessService.upsert(this.theThing);
        alert(`此遊程已標記全部完成`);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }

  async submitApplication() {
    const confirmMessage = `將此遊程規劃送出申請？`;
    if (confirm(confirmMessage)) {
      try {
        this.theThing.setState(
          ImitationOrder.stateName,
          ImitationOrder.states.applied
        );
        await this.theThingAccessService.upsert(this.theThing);
        alert(`此遊程已送出申請`);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }

  async setState(state: TheThingState) {
    this.tourPlanFactory.setState(state);
    // const confirmMessage = `取消此遊程規劃的申請？`;
    // if (confirm(confirmMessage)) {
    //   try {
    //     this.theThing.setState(
    //       ImitationOrder.stateName,
    //       ImitationOrder.states.new
    //     );
    //     await this.theThingAccessService.upsert(this.theThing);
    //     alert(`已取消遊程規劃申請`);
    //   } catch (error) {
    //     alert(`送出失敗，錯誤原因：${error.message}`);
    //   }
    // }
  }

  isPreviousCellInvalid(index: number): boolean {
    const prevIndex = index - 1;
    if (prevIndex < 0 || prevIndex >= this.requiredCells.length) {
      return false;
    }
    const prevCell = this.requiredCells[prevIndex];
    const control = this.formGroup.get(prevCell.name);
    // console.log(control);
    return !control || !control.value;
  }

  addCellControl(cell: TheThingCell, options: { required?: boolean } = {}) {
    const validators = [];
    if (options.required) {
      validators.push(Validators.required);
    }
    const control = new FormControl(cell.value, validators);
    this.subscriptions.push(
      control.valueChanges.subscribe(value =>
        this.tourPlanFactory.modify({
          command: 'update',
          target: 'cell',
          field: cell.name,
          value
        })
      )
    );
    this.formGroup.setControl(cell.name, control);
  }

  addCell() {
    const dialogRef = this.dialog.open(CellCreatorComponent, {
      title: '新增其他項目',
      data: {
        presetCells: ImitationTourPlan.createOptionalCells()
      }
    });
    dialogRef.afterClosed().subscribe(cell => {
      if (!!cell) {
        if (!!this.formGroup.get(cell.name)) {
          this.emcee.alert(`資料欄位 ${cell.name} 已存在`, AlertType.Warning);
        } else {
          // console.dir(cell);
          this.tourPlanFactory.modify({
            command: 'add',
            target: 'cell',
            field: cell.name,
            value: cell,
            emit: true
          });
        }
      }
    });
  }

  deleteCell(cell: TheThingCell) {
    this.tourPlanFactory.modify({
      command: 'delete',
      target: 'cell',
      field: cell.name,
      value: cell,
      emit: true
    });
  }

  isRequiredCellsFilled() {
    for (const cell of this.requiredCells) {
      const control = this.formGroup.get(cell.name);
      if (!control || !control.value) {
        return false;
      }
    }
    return true;
  }

  updateTheThing() {
    this.theThing.name = this.formGroup.get('name').value;
    for (const cell of this.requiredCells.concat(this.otherCells)) {
      cell.value = this.formGroup.get(cell.name).value;
      this.theThing.upsertCell(cell);
    }
  }

  importToCart() {
    const purchases = this.theThing
      .getRelations(RelationPurchase.name)
      .map(r => Purchase.fromRelation(r));
    this.shoppingCart.importPurchases(purchases);
  }

  async save() {
    this.tourPlanFactory.save();
  }

  isValidTourPlan(): boolean {
    return !!this.theThing;
  }

  isState(state: TheThingState): boolean {
    return !!this.state && this.state.value === state.value;
  }

  // getOptionalCells(): TheThingCell[] {
  //   return this.theThing.getCellsByNames(
  //     omit(
  //       keys(this.theThing.cells),
  //       this.requiredCells.map(c => c.name)
  //     )
  //   );
  // }
}
