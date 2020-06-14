import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
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
import { isEmpty, values, remove } from 'lodash';
import { Observable, Subscription, merge } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TheThingImitationViewInterface } from '..';
import { CellCreatorComponent, validateCellRequired } from '../../cell';
import { TheThingFactoryService } from '../../the-thing-factory.service';

@Component({
  selector: 'the-thing',
  templateUrl: './the-thing.component.html',
  styleUrls: ['./the-thing.component.css']
})
export class TheThingComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() imitation: TheThingImitation;
  @Input() theThing$: Observable<TheThing>;
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
  orderedCellNames: string[] = [];
  relationsMap: { [name: string]: TheThingRelation[] } = {};
  actions: TheThingAction[] = [];
  actions$Subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private theThingFactory: TheThingFactoryService,
    private formBuilder: FormBuilder,
    private authorizeService: AuthorizeService,
    private dialog: YggDialogService,
    private emcee: EmceeService
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required]
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

  async ngOnInit() {
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
    for (const cellName in this.formGroupCells.controls) {
      if (this.formGroupCells.controls.hasOwnProperty(cellName)) {
        this.formGroupCells.removeControl(cellName);
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

          // Remove redundant controls
          for (const cellName in this.formGroupCells) {
            if (this.formGroupCells.hasOwnProperty(cellName)) {
              if (!this.theThing.hasCell(cellName)) {
                this.formGroupCells.removeControl(cellName);
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
      console.error(`TheThingComponent: theThing$ is empty: ${theThing$}`);
    }

    if (this.actions$Subscription) {
      this.actions$Subscription.unsubscribe();
    }
    this.actions$Subscription = this.theThingFactory
      .getPermittedActions$(theThing$, this.imitation)
      .subscribe(actions => (this.actions = actions));
  }

  ngOnDestroy(): void {
    for (const subcsription of this.subscriptions) {
      subcsription.unsubscribe();
    }
    this.focusSubscription.unsubscribe();
    this.actions$Subscription.unsubscribe();
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
          this.theThingFactory.setCell(this.theThing, cell, this.imitation)
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
    this.theThingFactory.save(this.theThing);
  }

  addCell() {
    const dialogRef = this.dialog.open(CellCreatorComponent, {
      title: '新增其他資料',
      data: {
        presetCells: this.imitation.createOptionalCells()
      }
    });
    dialogRef.afterClosed().subscribe(cell => {
      if (!!cell) {
        if (cell.name in this.formGroupCells.controls) {
          this.emcee.alert(`資料欄位 ${cell.name} 已存在`, AlertType.Warning);
        } else {
          this.addCellControl(cell);
          this.theThingFactory.setCell(this.theThing, cell, this.imitation);
        }
      }
    });
  }

  async deleteCell(cellName: string) {
    await this.theThingFactory.deleteCell(this.theThing, cellName);
    this.formGroupCells.removeControl(cellName);
    remove(this.orderedCellNames, _name => _name === cellName);
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