import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertType } from '@ygg/shared/infra/core';
import { EmceeService, YggDialogService } from '@ygg/shared/ui/widgets';
import { AuthorizeService } from '@ygg/shared/user/ui';
import {
  Relationship,
  TheThing,
  TheThingCell,
  TheThingImitation,
  TheThingRelation,
  TheThingAction
} from '@ygg/the-thing/core';
import { isEmpty, values, remove, extend, find } from 'lodash';
import { Observable, Subscription, merge, combineLatest } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TheThingImitationViewInterface } from '..';
import { CellCreatorComponent, validateCellRequired } from '../../cell';
import { TheThingFactoryService } from '../../the-thing-factory.service';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import {
  ImageUploaderComponent,
  ImageUploaderService
} from '@ygg/shared/omni-types/ui';

interface ActionButton extends TheThingAction {
  granted: boolean;
}

@Component({
  selector: 'the-thing',
  templateUrl: './the-thing.component.html',
  styleUrls: ['./the-thing.component.css']
})
export class TheThingComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() imitation: TheThingImitation;
  @Input() theThing$: Observable<TheThing>;
  @Input() showOwner = false;
  subscriptions: Subscription[] = [];
  // theThing$: Observable<TheThing>;
  focusSubscription: Subscription;
  theThing: TheThing;
  formGroup: FormGroup;
  formGroupCells: FormGroup;
  readonly = true;
  nameStyle = {
    'font-size': '24px',
    'text-shadow': '3px 3px 3px #FDFFC7'
  };
  orderedCellIds: string[] = [];
  relationsMap: { [name: string]: TheThingRelation[] } = {};
  actionButtons: ActionButton[] = [];
  actions$Subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private theThingFactory: TheThingFactoryService,
    private formBuilder: FormBuilder,
    private authorizeService: AuthorizeService,
    private dialog: YggDialogService,
    private emcee: EmceeService,
    private imageUploaderService: ImageUploaderService
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      image: ''
    });
    this.formGroup.valueChanges.subscribe(value =>
      this.theThingFactory.setMeta(this.theThing, value)
    );
    this.formGroupCells = this.formBuilder.group({});
    this.subscriptions.push(
      this.theThingFactory.focusChange$.subscribe(focus$ => {
        this.imitation = this.theThingFactory.imitation;
        this.resetFocus(focus$);
      })
    );
  }

  ngOnInit() {
    if (this.id) {
      this.resetFocus(this.theThingFactory.load$(this.id));
    }
    if (!!this.theThing$) {
      this.resetFocus(this.theThing$);
    }
  }

  async resetFocus(theThing$: Observable<TheThing>) {
    // Clear form
    // this.formGroup.reset();
    for (const cellId in this.formGroupCells.controls) {
      if (this.formGroupCells.controls.hasOwnProperty(cellId)) {
        this.formGroupCells.removeControl(cellId);
      }
    }

    if (theThing$) {
      const updateTheThing$ = theThing$.pipe(
        // tap(theThing => {
        //   console.log('Update the thing');
        //   console.dir(theThing);
        // }),
        tap(theThing => (this.theThing = theThing)),
        tap(() => {
          this.formGroup.patchValue(this.theThing);

          const requiredCellDefs = this.imitation.getRequiredCellDefs();
          // Add required cell controls
          for (const requiredCellDef of requiredCellDefs) {
            let cell = this.theThing.getCell(requiredCellDef.id);
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

          // Remove redundant controls
          for (const cellId in this.formGroupCells) {
            if (this.formGroupCells.hasOwnProperty(cellId)) {
              if (!this.theThing.hasCell(cellId)) {
                this.formGroupCells.removeControl(cellId);
              }
            }
          }

          // Extract relations
          this.relationsMap = {};
          for (const name in this.imitation.relationships) {
            if (this.imitation.relationships.hasOwnProperty(name)) {
              const relationship = this.imitation.relationships[name];
              this.relationsMap[relationship.name] = this.theThing.getRelations(
                relationship.name
              );
            }
          }
        })
      );

      const canModify$ = updateTheThing$.pipe(
        switchMap(() => this.authorizeService.canModify$(this.theThing)),
        tap(canModify => {
          this.readonly = !(
            canModify && this.imitation.canModify(this.theThing)
          );
        })
      );

      if (this.focusSubscription) {
        this.focusSubscription.unsubscribe();
      }
      this.focusSubscription = merge(updateTheThing$, canModify$).subscribe();
    } else {
      console.warn(`TheThingComponent: theThing$ is empty: ${theThing$}`);
    }

    if (this.actions$Subscription) {
      this.actions$Subscription.unsubscribe();
    }
    if (theThing$ && this.imitation && !isEmpty(this.imitation.actions)) {
      this.actionButtons = values(this.imitation.actions).map(action =>
        extend(action, { granted: false })
      );
      this.actions$Subscription = theThing$
        .pipe(
          // tap(() => console.log(`Hi~ MAMA!!`)),
          switchMap(theThing => {
            const actionPermissionChecks: Observable<any>[] = [];
            for (const actionButton of this.actionButtons) {
              actionPermissionChecks.push(
                this.theThingFactory
                  .isActionGranted$(theThing.id, actionButton, this.imitation)
                  .pipe(
                    // tap(isGranted =>
                    //   console.log(
                    //     `Action ${actionButton.id} is granted: ${isGranted}`
                    //   )
                    // ),
                    tap(isGranted => (actionButton.granted = isGranted))
                  )
              );
            }
            return merge(...actionPermissionChecks);
          })
        )
        .subscribe();
      // this.actions$Subscription = this.theThingFactory
      //   .getPermittedActions$(theThing$, this.imitation)
      //   .subscribe(actions => {
      //     this.actions = actions.filter(
      //       action => !(action && action.display && action.display.position)
      //     );
      //     // console.dir(this.actions);
      //   });
    }
  }

  ngOnDestroy(): void {
    for (const subcsription of this.subscriptions) {
      subcsription.unsubscribe();
    }
    if (this.focusSubscription) {
      this.focusSubscription.unsubscribe();
    }
    if (this.actions$Subscription) {
      this.actions$Subscription.unsubscribe();
    }
  }

  async changeImage() {
    const images = await this.imageUploaderService.uploadImages();
    if (!isEmpty(images)) {
      this.formGroup.get('image').setValue(images[0].src);
    }
  }

  addCellControl(cell: TheThingCell, options: { required?: boolean } = {}) {
    let control = this.formGroupCells.get(cell.id);
    if (!control) {
      const validators = [];
      if (options.required) {
        validators.push(validateCellRequired);
      }
      control = new FormControl(null, validators);
      this.formGroupCells.setControl(cell.id, control);
      this.subscriptions.push(
        control.valueChanges.subscribe((_cell: TheThingCell) =>
          this.theThingFactory.setCell(this.theThing, _cell, this.imitation)
        )
      );
    }
    control.setValue(cell, { emitEvent: false });
    if (this.orderedCellIds.indexOf(cell.id) < 0) {
      this.orderedCellIds.push(cell.id);
    }
  }

  isCellRequired(cellId: string): boolean {
    const requiredCellIds = this.imitation.getRequiredCellIds();
    return requiredCellIds.indexOf(cellId) >= 0;
  }

  isCellControlShown(cellId: string): boolean {
    const requiredCellIds = this.imitation.getRequiredCellIds();
    const index = requiredCellIds.indexOf(cellId);
    if (index >= 0) {
      // It's a required cell
      if (index > 0) {
        // Only if previous required filled
        const prevRequiredName = requiredCellIds[index - 1];
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

  getCellLabel(cellId: string): string {
    let label: string;
    if (this.theThing) {
      const cell = this.theThing.getCell(cellId);
      if (cell) {
        label = cell.label;
      }
    }
    if (!label && this.imitation) {
      const cellDefine = this.imitation.getCellDef(cellId);
      if (cellDefine) {
        label = cellDefine.label;
      }
    }
    if (!label) {
      label = cellId;
    }
    return label;
  }

  isThingValid(): boolean {
    const errors = this.imitation.validate(this.theThing);
    if (!isEmpty(errors)) {
      return false;
    } else {
      return true;
    }
  }

  save() {
    this.theThingFactory.save(this.theThing, {
      imitation: this.imitation,
      requireOwner: true
    });
  }

  addCell() {
    const dialogRef = this.dialog.open(CellCreatorComponent, {
      title: '新增其他資料',
      data: {
        presets: this.imitation.getOptionalCellDefs()
      }
    });
    dialogRef.afterClosed().subscribe(cell => {
      if (!!cell) {
        const duplicatedCell = find(
          values(this.formGroupCells.controls).map(control => control.value),
          (_cell: TheThingCell) => {
            return (
              _cell && _cell.label === cell.label && _cell.type === cell.type
            );
          }
        );
        if (!!duplicatedCell) {
          this.emcee.alert(
            `資料欄位 ${duplicatedCell.label}(${
              OmniTypes[duplicatedCell.type].label
            }) 已存在`,
            AlertType.Warning
          );
        } else {
          this.addCellControl(cell);
          this.theThingFactory.setCell(this.theThing, cell, this.imitation);
        }
      }
    });
  }

  async deleteCell(cellId: string) {
    await this.theThingFactory.deleteCell(this.theThing, cellId);
    this.formGroupCells.removeControl(cellId);
    remove(this.orderedCellIds, _name => _name === cellId);
  }

  async gotoRelateObjectCreate(relationship: Relationship) {
    await this.theThingFactory.createRelationObjectOnTheFly(
      this.theThing,
      relationship
    );
  }

  runAction(action: TheThingAction) {
    this.theThingFactory.runAction(action, this.theThing);
  }
}
