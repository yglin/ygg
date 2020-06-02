import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  TheThingImitationViewInterface,
  validateCellRequired,
  CellCreatorComponent
} from '@ygg/the-thing/ui';
import { Subscription, Observable } from 'rxjs';
import {
  TheThing,
  TheThingImitation,
  TheThingRelation,
  TheThingCell
} from '@ygg/the-thing/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { ImitationEquipment } from '@ygg/playwhat/core';
import { EquipmentFactoryService } from '../../../equipment-factory.service';
import { AuthorizeService } from '@ygg/shared/user/ui';
import { YggDialogService, EmceeService } from '@ygg/shared/ui/widgets';
import { tap, switchMap } from 'rxjs/operators';
import { values, isEmpty } from 'lodash';
import { AlertType } from '@ygg/shared/infra/core';

@Component({
  selector: 'ygg-equipment-view',
  templateUrl: './equipment-view.component.html',
  styleUrls: ['./equipment-view.component.css']
})
export class EquipmentViewComponent
  implements OnInit, OnDestroy, TheThingImitationViewInterface {
  subscriptions: Subscription[] = [];
  theThing$: Observable<TheThing>;
  theThing: TheThing;
  formGroup: FormGroup;
  formGroupCells: FormGroup;
  imitation: TheThingImitation = ImitationEquipment;
  readonly = true;
  nameStyle = {
    'font-size': '24px',
    'text-shadow': '3px 3px 3px #FDFFC7'
  };
  orderedCellNames: string[] = [];
  equipmentRelations: TheThingRelation[] = [];

  constructor(
    private equipmentFactory: EquipmentFactoryService,
    private formBuilder: FormBuilder,
    private authorizeService: AuthorizeService,
    private dialog: YggDialogService,
    private emcee: EmceeService
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.formGroup.valueChanges.subscribe(value =>
      this.equipmentFactory.setMeta(value)
    );
    this.formGroupCells = this.formBuilder.group({});
  }

  async ngOnInit() {
    this.theThing$ = await this.equipmentFactory.loadTheOne();
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

          // Extract equipment relations
          this.equipmentRelations = this.theThing.getRelations(
            ImitationEquipment.name
          );
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
          this.equipmentFactory.setCell(cell)
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
    this.equipmentFactory.save();
  }

  addCell() {
    const dialogRef = this.dialog.open(CellCreatorComponent, {
      title: '新增其他資料',
      data: {
        presetCells: ImitationEquipment.createOptionalCells()
      }
    });
    dialogRef.afterClosed().subscribe(cell => {
      if (!!cell) {
        if (!!this.formGroup.get(cell.name)) {
          this.emcee.alert(`資料欄位 ${cell.name} 已存在`, AlertType.Warning);
        } else {
          this.addCellControl(cell);
          this.equipmentFactory.setCell(cell);
        }
      }
    });
  }

  async deleteCell(cellName: string) {
    await this.equipmentFactory.deleteCell(cellName);
    this.formGroupCells.removeControl(cellName);
  }
}
