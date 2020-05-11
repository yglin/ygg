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
  ImitationOrder,
  Purchase,
  RelationNamePurchase
} from '@ygg/shopping/core';
import { IInputShoppingCart } from '@ygg/shopping/ui';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import {
  CellCreatorComponent,
  TheThingFactoryService,
  TheThingImitationViewInterface
} from '@ygg/the-thing/ui';
import { get, isEmpty, keys, mapValues, omit, values, remove } from 'lodash';
import { from, merge, Observable, of, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

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
  purchases: Purchase[] = [];
  requiredCells: TheThingCell[] = [];
  otherCells: TheThingCell[] = [];
  subscriptions: Subscription[] = [];
  canSubmitApplication = false;
  isAdmin = false;
  // isOwner = false;
  state: number;
  stateLabel: string;
  states: { [key: string]: number } = {};
  canCancelApplied = false;
  formGroup: FormGroup;
  formControlName: FormControl = new FormControl(null, [Validators.required]);
  nameStyle = {
    'font-size': '24px',
    'text-shadow': '3px 3px 3px #FDFFC7'
  };

  constructor(
    private authorizeService: AuthorizeService,
    private theThingAccessService: TheThingAccessService,
    private theThingFactory: TheThingFactoryService,
    private pageResolver: PageResolverService,
    private router: Router,
    private dialog: YggDialogService,
    private emcee: EmceeService,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('name', this.formControlName);
  }

  ngOnInit() {
    // console.log('Tour View ~!!!');
    this.readonly = this.readonly !== undefined && this.readonly !== false;
    if (!this.theThing$) {
      if (this.theThing) {
        this.theThing$ = of(this.theThing);
      } else {
        this.theThing$ = from(
          this.theThingFactory.create({ imitation: ImitationTourPlan.id })
        );
      }
    }
    const theThingUpdate$ = this.theThing$.pipe(
      // tap(theThing => {
      //   console.log('Update tour plan view');
      //   console.dir(theThing.toJSON());
      // }),
      filter(theThing => !!theThing),
      tap(theThing => {
        // Force Angular to trigger change detection
        this.theThing = undefined;
        setTimeout(() => {
          this.theThing = theThing;

          this.formControlName.setValue(this.theThing.name, {
            emitEvent: false
          });

          this.updateFromPageResolver(this.theThing);

          for (const controlName in this.formGroup.controls) {
            if (this.formGroup.controls.hasOwnProperty(controlName)) {
              if (controlName !== 'name') {
                this.formGroup.removeControl(controlName);
              }
            }
          }

          this.requiredCells = ImitationTourPlan.getRequiredCellDefs().map(
            cellDef => cellDef.createCell()
          );

          for (const cell of this.requiredCells) {
            cell.value = this.theThing.getCellValue(cell.name);
            this.addCellControl(cell, { required: true });
          }

          this.subscriptions.push(
            this.formGroup
              .get(CellNames.dateRange)
              .valueChanges.subscribe(value => {
                if (
                  DateRange.isDateRange(value) &&
                  !this.formControlName.value
                ) {
                  this.formControlName.setValue(defaultTourPlanName(value), {
                    emitEvent: false
                  });
                }
              })
          );

          this.otherCells = values(this.theThing.cells).filter(cell => {
            const cellDef = ImitationTourPlan.getCellDef(cell.name);
            if (
              !!cellDef &&
              (cellDef.userInput === 'required' ||
                cellDef.userInput === 'hidden')
            ) {
              return false;
            }
            return true;
          });
          for (const cell of this.otherCells) {
            this.addCellControl(cell);
          }

          this.purchases = this.theThing
            .getRelations(RelationNamePurchase)
            .map(r => Purchase.fromRelation(r));

          // this.isOwner = this.authorizeService.isOwner(this.theThing);
          this.readonly =
            this.readonly || !this.authorizeService.canModify(this.theThing);

          this.state = this.theThing.getState(ImitationOrder.stateName);
          this.states = mapValues(ImitationOrder.states, s => s.value);
          this.stateLabel = ImitationTourPlan.getStateLabel(this.state);
          this.canCancelApplied =
            this.authorizeService.isOwner(this.theThing) &&
            this.theThing.isState(
              ImitationOrder.stateName,
              ImitationOrder.states.applied.value
            );
          this.canSubmitApplication =
            this.authorizeService.isOwner(this.theThing) &&
            this.theThing.isState(
              ImitationOrder.stateName,
              ImitationOrder.states.new.value
            );
        }, 0);
      })
    );
    const isAdmin$ = this.authorizeService.isAdmin().pipe(
      tap(isAdmin => {
        this.isAdmin = isAdmin;
      })
    );
    const nameChange$ = this.formControlName.valueChanges.pipe(
      tap(name => {
        if (this.theThing && name) {
          this.theThing.name = name;
        }
      })
    );
    this.subscriptions.push(
      merge(theThingUpdate$, isAdmin$, nameChange$).subscribe()
    );
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
        RelationNamePurchase,
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
      .getRelations(RelationNamePurchase)
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

  async cancelApplied() {
    const confirmMessage = `取消此遊程規劃的申請？`;
    if (confirm(confirmMessage)) {
      try {
        this.theThing.setState(
          ImitationOrder.stateName,
          ImitationOrder.states.new
        );
        await this.theThingAccessService.upsert(this.theThing);
        alert(`已取消遊程規劃申請`);
      } catch (error) {
        alert(`送出失敗，錯誤原因：${error.message}`);
      }
    }
  }

  isPreviousCellInvalid(index: number): boolean {
    const prevIndex = index - 1;
    if (prevIndex < 0 || prevIndex >= this.requiredCells.length) {
      return false;
    }
    const prevCell = this.requiredCells[prevIndex];
    const control = this.formGroup.get(prevCell.name);
    return !control || !control.value;
  }

  addCellControl(cell: TheThingCell, options: { required?: boolean } = {}) {
    const validators = [];
    if (options.required) {
      validators.push(Validators.required);
    }
    const control = new FormControl(cell.value, validators);
    this.formGroup.registerControl(cell.name, control);
    // control.setValue(cell.value);
    // control.setValue(cell.value);
    // console.log(this.formGroup.get(cell.name) === control ? 'true' : 'false');
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
          this.addCellControl(cell);
          this.otherCells.push(cell);
        }
      }
    });
  }

  deleteCell(cell: TheThingCell) {
    remove(this.otherCells, c => c.name === cell.name);
    if (!!this.formGroup.get(cell.name)) {
      this.formGroup.removeControl(cell.name);
    }
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

  async save() {
    this.updateTheThing();
    try {
      await this.theThingFactory.save(this.theThing, {
        requireOwner: true
      });
      this.router.navigate(['/', 'the-things', this.theThing.id]);
    } catch (error) {}
  }

  isValidTourPlan(): boolean {
    return !!this.theThing;
  }

  getOptionalCells(): TheThingCell[] {
    return this.theThing.getCellsByNames(
      omit(
        keys(this.theThing.cells),
        this.requiredCells.map(c => c.name)
      )
    );
  }
}
