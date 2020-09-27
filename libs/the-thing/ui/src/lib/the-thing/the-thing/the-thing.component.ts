import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertType } from '@ygg/shared/infra/core';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { ImageUploaderService } from '@ygg/shared/omni-types/ui';
import { EmceeService, YggDialogService } from '@ygg/shared/ui/widgets';
import { AuthorizeService } from '@ygg/shared/user/ui';
import {
  Relationship,
  TheThing,
  TheThingAction,
  TheThingCell,
  TheThingDisplay,
  TheThingImitation,
  TheThingRelation
} from '@ygg/the-thing/core';
import { defaults, extend, find, isEmpty, remove, values } from 'lodash';
import { merge, Observable, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { CellCreatorComponent, validateCellRequired } from '../../cell';
import { TheThingFactoryService } from '../../the-thing-factory.service';

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
  @Input() display: TheThingDisplay;
  subscription: Subscription = new Subscription();
  // theThing$: Observable<TheThing>;
  // focusSubscription: Subscription;
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
  reloadSubscriptions: Subscription = new Subscription();
  // actions$Subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private theThingFactory: TheThingFactoryService,
    private formBuilder: FormBuilder,
    private authorizeService: AuthorizeService,
    private dialog: YggDialogService,
    private emcee: EmceeService,
    private imageUploaderService: ImageUploaderService,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      image: ''
    });
    this.formGroup.valueChanges.subscribe(value =>
      this.theThingFactory.setMeta(this.theThing, value)
    );
    this.formGroupCells = this.formBuilder.group({});
  }

  reload(): void {
    // console.log('TheThingComponent reload~!!!');
    this.reloadSubscriptions.unsubscribe();
    this.reloadSubscriptions = new Subscription();

    this.display = defaults(this.display, {
      showCells: true,
      showRelations: true
    });

    this.imitation = this.route.snapshot.data.imitation || this.imitation;
    if (!this.imitation) {
      this.emcee.error(`資料載入失敗，Not found Imitation`);
      this.router.navigate([]);
      return;
    }

    this.theThing$ = this.route.snapshot.data.theThing$ || this.theThing$;
    if (!this.theThing$ && this.id) {
      this.theThing$ = this.theThingFactory.load$(
        this.id,
        this.imitation.collection
      );
    }
    if (!this.theThing$) {
      this.emcee.error(`資料載入失敗，Not found theThing$`);
      this.router.navigate([]);
      return;
    }

    for (const cellId in this.formGroupCells.controls) {
      if (this.formGroupCells.controls.hasOwnProperty(cellId)) {
        this.formGroupCells.removeControl(cellId);
      }
    }

    const updateTheThing$ = this.theThing$.pipe(
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
    this.reloadSubscriptions.add(updateTheThing$.subscribe());

    const canModify$ = updateTheThing$.pipe(
      switchMap(() => this.authorizeService.canModify$(this.theThing)),
      tap(canModify => {
        this.readonly = !(canModify && this.imitation.canModify(this.theThing));
      })
    );
    this.reloadSubscriptions.add(canModify$.subscribe());

    if (!isEmpty(this.imitation.actions)) {
      this.actionButtons = values(this.imitation.actions).map(action =>
        extend(action, { granted: false })
      );
      for (const actionButton of this.actionButtons) {
        this.reloadSubscriptions.add(
          this.theThing$
            .pipe(
              switchMap(theThing =>
                this.theThingFactory.isActionGranted$(
                  theThing,
                  actionButton,
                  this.imitation
                )
              ),
              tap(isGranted => {
                // console.log(
                //   `Action ${actionButton.id} is granted: ${isGranted}`
                // );
                actionButton.granted = isGranted;
              })
            )
            .subscribe()
        );
      }
    }
  }

  ngOnInit() {
    this.reload();
    this.subscription.add(
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          tap(() => this.reload())
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.reloadSubscriptions.unsubscribe();
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
      this.reloadSubscriptions.add(
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

  async save() {
    // console.log(`Save TheThing ${this.theThing.id}`);
    // this.theThing$.subscribe(theThing => {
    //   console.log(`FUUUUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQQQQQ~~~!!!!`);
    //   console.dir(theThing);
    // });
    await this.theThingFactory.save(this.theThing, this.imitation, {
      requireOwner: true
    });
    // if (
    //   !(
    //     this.theThing$ ===
    //     this.theThingFactory.theThingSources$[this.theThing.id].local$
    //   )
    // ) {
    //   console.log(`MAMA What's going on !!! I can't stand it`);
    // }
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
