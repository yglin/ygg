import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ImitationPlay } from '@ygg/playwhat/core';
import { ShoppingCartService } from '@ygg/shopping/ui';
import { TheThing, TheThingCell, TheThingImitation } from '@ygg/the-thing/core';
import {
  TheThingImitationViewInterface,
  validateCellRequired,
  CellCreatorComponent
} from '@ygg/the-thing/ui';
import { isEmpty, values, extend } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { PlayFactoryService } from '../../play-factory.service';
import { AuthorizeService } from '@ygg/shared/user/ui';
import { YggDialogService, EmceeService } from '@ygg/shared/ui/widgets';
import { AlertType } from '@ygg/shared/infra/core';

@Component({
  selector: 'ygg-play-view',
  templateUrl: './play-view.component.html',
  styleUrls: ['./play-view.component.css']
})
export class PlayViewComponent
  implements OnInit, OnDestroy, TheThingImitationViewInterface {
  subscriptions: Subscription[] = [];
  theThing$: Observable<TheThing>;
  theThing: TheThing;
  formGroup: FormGroup;
  formGroupCells: FormGroup;
  imitation: TheThingImitation = ImitationPlay;
  readonly = true;
  nameStyle = {
    'font-size': '24px',
    'text-shadow': '3px 3px 3px #FDFFC7'
  };
  orderedCellNames: string[] = [];

  constructor(
    private playFactory: PlayFactoryService,
    private cartService: ShoppingCartService,
    private formBuilder: FormBuilder,
    private authorizeService: AuthorizeService,
    private dialog: YggDialogService,
    private emcee: EmceeService
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.formGroup.valueChanges.subscribe(value =>
      this.playFactory.setMeta(value)
    );
    this.formGroupCells = this.formBuilder.group({});
  }

  async ngOnInit() {
    this.theThing$ = await this.playFactory.loadTheOne();
    this.theThing$
      .pipe(
        tap(theThing => (this.theThing = theThing)),
        tap(() => {
          this.formGroup.patchValue(this.theThing);

          const requiredCellDefs = this.imitation.getRequiredCellDefs();
          // Add required cell controls
          for (const requiredCellDef of requiredCellDefs) {
            let cell = this.theThing.getCell(requiredCellDef.name);
            if (!cell) {
              cell = requiredCellDef.createCell();
            }
            this.addCellControl(cell, { required: true });
          }

          // Add additional cell controls if theThing is valid
          const additionalCells = this.imitation.pickNonRequiredCells(
            values(this.theThing.cells)
          );
          for (const additionalCell of additionalCells) {
            this.addCellControl(additionalCell);
          }
        }),
        switchMap(() => {
          return this.authorizeService.canModify$(this.theThing);
        }),
        tap(canModify => (this.readonly = !canModify))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    for (const subcsription of this.subscriptions) {
      subcsription.unsubscribe();
    }
  }

  addCellControl(cell: TheThingCell, options: { required?: boolean } = {}) {
    let control = this.formGroupCells.get(cell.name);
    if (!control) {
      const validators = [];
      if (options.required) {
        validators.push(validateCellRequired);
      }
      control = new FormControl(null, validators);
      this.formGroupCells.setControl(cell.name, control);
      this.subscriptions.push(
        control.valueChanges.subscribe((cell: TheThingCell) =>
          this.playFactory.setCell(cell)
        )
      );
    }
    control.setValue(cell, { emitEvent: false });
    if (this.orderedCellNames.indexOf(cell.name) < 0) {
      this.orderedCellNames.push(cell.name);
    }
  }

  isCellRequired(cellName: string): boolean {
    const requiredCellNames = this.imitation.getRequiredCellNames();
    return requiredCellNames.indexOf(cellName) >= 0;
  }

  isCellControlShown(cellName: string): boolean {
    const requiredCellNames = this.imitation.getRequiredCellNames();
    const index = requiredCellNames.indexOf(cellName);
    if (index >= 0) {
      // It's a required cell
      if (index > 0) {
        // Only if previous required filled
        const prevRequiredName = requiredCellNames[index - 1];
        const prevControl = this.formGroupCells.get(prevRequiredName);
        return prevControl && prevControl.valid;
      } else {
        // Always show the first one
        return true;
      }
    } else {
      // Not a required cell
      return this.isThingValid();
    }
  }

  isThingValid(): boolean {
    return isEmpty(this.imitation.validate(this.theThing));
  }

  save() {
    this.playFactory.save();
  }

  addCell() {
    const dialogRef = this.dialog.open(CellCreatorComponent, {
      title: '新增其他資料',
      data: {
        presetCells: ImitationPlay.createOptionalCells()
      }
    });
    dialogRef.afterClosed().subscribe(cell => {
      if (!!cell) {
        if (!!this.formGroup.get(cell.name)) {
          this.emcee.alert(`資料欄位 ${cell.name} 已存在`, AlertType.Warning);
        } else {
          this.addCellControl(cell);
          this.playFactory.setCell(cell);
        }
      }
    });
  }

  purchase() {
    this.cartService.add(this.theThing);
  }
}
