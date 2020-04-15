import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { TheThing, TheThingCell, TheThingRelation } from '@ygg/the-thing/core';
import { DateRange, DayTimeRange, Contact } from '@ygg/shared/omni-types/core';
import {
  TheThingImitationViewInterface,
  TheThingFactoryService,
  CellCreatorComponent
} from '@ygg/the-thing/ui';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import {
  Subscription,
  Observable,
  BehaviorSubject,
  of,
  Subject,
  combineLatest,
  merge
} from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';
import { ImitationTourPlan, ImitationPlay } from '@ygg/playwhat/core';
import { pick, values, mapValues, get, isEmpty } from 'lodash';
import {
  RelationNamePurchase,
  Purchase,
  ImitationOrder
} from '@ygg/shopping/core';
import { AuthorizeService, AuthenticateService } from '@ygg/shared/user/ui';
import { TourPlanBuilderService } from '../tour-plan-builder/tour-plan-builder.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PageStashService } from '@ygg/shared/infra/data-access';
import { PageResolverService } from '@ygg/shared/ui/navigation';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { IInputShoppingCart } from '@ygg/shopping/ui';

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
  optionalCells: TheThingCell[] = [];
  subscriptions: Subscription[] = [];
  canSubmitApplication = false;
  isAdmin = false;
  // isOwner = false;
  state: number;
  stateLabel: string;
  states: { [key: string]: number } = {};
  canCancelApplied = false;
  formControlName: FormControl = new FormControl(null);

  constructor(
    private authorizeService: AuthorizeService,
    private theThingAccessService: TheThingAccessService,
    private theThingFactory: TheThingFactoryService,
    private pageResolver: PageResolverService,
    private router: Router,
    private dialog: YggDialogService
  ) {}

  ngOnInit() {
    this.readonly = this.readonly !== undefined && this.readonly !== false;
    if (!this.theThing$) {
      this.theThing$ = of(null);
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
          // this.dateRange = theThing.getCellValue('預計出遊日期');
          // // this.dayTimeRange = this.tourPlan.cells['預計遊玩時間'].value;
          // this.numParticipants = theThing.getCellValue('預計參加人數');
          // // console.log(this.numParticipants);
          // this.contact = theThing.getCellValue('聯絡資訊');

          this.formControlName.setValue(this.theThing.name, {
            emitEvent: false
          });

          this.updateFromPageResolver(this.theThing);

          this.requiredCells = this.theThing.getCellsByNames(
            ImitationTourPlan.getRequiredCellNames()
          );
          this.optionalCells = this.theThing.getCellsByNames(
            ImitationTourPlan.getOptionalCellNames()
          );

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
          // console.log(this.theThing.name);
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

  addCell() {
    const dialogRef = this.dialog.open(CellCreatorComponent, {
      title: '新增其他項目',
      data: {
        presetCells: ImitationTourPlan.createOptionalCells()
      }
    });
    dialogRef.afterClosed().subscribe(cell => {
      if (!!cell) {
        // console.log(`Add new cell ${cell.name}`);
        // console.dir(cell);
        this.theThing.addCell(cell);
      }
    });
  }

  deleteCell(cell: TheThingCell) {
    const confirmMessage = `移除資料欄位${cell.name}？`;
    if (confirm(confirmMessage)) {
      this.theThing.deleteCell(cell);
    }
  }

  async save() {
    if (confirm(`確定儲存此遊程規劃？`)) {
      try {
        await this.theThingFactory.save({ requireOwner: true });
      } catch (error) {
        console.error(error.message);
      }
      this.router.navigate(['/', 'the-things', this.theThing.id]);
    }
  }

  isValidTourPlan(): boolean {
    return !!this.theThing;
  }

  getOptionalCells(): TheThingCell[] {
    return this.theThing.getCellsByNames(
      ImitationTourPlan.getOptionalCellNames()
    );
  }
}
