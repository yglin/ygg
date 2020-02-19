import { size, isEmpty, extend, get, mapValues, isArray, find } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  TheThing,
  TheThingCell,
  TheThingCellTypes,
  TheThingImitation,
  TheThingView
} from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { Tags } from '@ygg/tags/core';
import {
  YggDialogService,
  ImageThumbnailListComponent
} from '@ygg/shared/ui/widgets';
import {
  Observable,
  Subscription,
  of,
  combineLatest,
  Subject,
  merge
} from 'rxjs';
import { map, switchMap, take, catchError, timeout } from 'rxjs/operators';
import {
  PageStashService,
  PageStashPromise
} from '@ygg/shared/infra/data-access';
import { User, AuthenticateService } from '@ygg/shared/user';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { TheThingFinderComponent } from '../the-thing-finder/the-thing-finder.component';
import { TheThingViewsService } from '../../the-thing-views.service';

@Component({
  selector: 'the-thing-editor',
  templateUrl: './the-thing-editor.component.html',
  styleUrls: ['./the-thing-editor.component.css']
})
export class TheThingEditorComponent implements OnInit {
  @Input() theThing: TheThing;
  @Input() theThing$: Subject<TheThing>;
  @Output() theThingChanged: EventEmitter<TheThing> = new EventEmitter();
  @Input() embed: boolean;
  // @Input() onlyCells: string[] | boolean;
  formGroup: FormGroup;
  formControlCells: FormControl;
  // cellsFormGroup: FormGroup;
  // formControlNewCellType: FormControl;
  // cellTypes = TheThingCellTypes;
  // formControlNewCellName: FormControl;
  formControlNewRelationName: FormControl;
  isNewRelationNameEmpty = true;
  subscriptions: Subscription[] = [];
  currentUser: User;
  imitations: TheThingImitation[] = [];
  hasImitations: boolean = false;
  pendingRelation: any;
  relations: {
    [relationName: string]: { objects$: Observable<TheThing[]> };
  } = {};
  inProgressing: boolean = false;
  // canDeleteAllCells: boolean = false;
  views: { [id: string]: TheThingView } = {};

  constructor(
    private formBuilder: FormBuilder,
    private theThingAccessService: TheThingAccessService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: YggDialogService,
    private pageStashService: PageStashService,
    private authenticateService: AuthenticateService,
    private imitationAccessService: TheThingImitationAccessService,
    private theThingViewsService: TheThingViewsService
  ) {
    this.formGroup = formBuilder.group({
      tags: null,
      name: ['東東', Validators.required],
      view: null
    });
    this.formControlCells = new FormControl({});
    // this.cellsFormGroup = formBuilder.group({});
    // this.formControlNewCellType = new FormControl();
    // this.formControlNewCellName = new FormControl();
    this.formControlNewRelationName = new FormControl();

    this.subscriptions.push(
      this.imitationAccessService.list$().subscribe(imitations => {
        this.imitations = imitations;
        this.hasImitations = !isEmpty(this.imitations);
      })
    );

    this.subscriptions.push(
      this.formControlNewRelationName.valueChanges.subscribe(value => {
        this.isNewRelationNameEmpty = !value;
      })
    );
    this.subscriptions.push(
      this.authenticateService.currentUser$.subscribe(
        user => (this.currentUser = user)
      )
    );

    this.subscriptions.push(
      merge(
        this.formGroup.valueChanges,
        this.formControlCells.valueChanges
      ).subscribe(() => {
        this.updateTheThing();
        this.theThingChanged.emit(this.theThing);
      })
    );
    this.views = this.theThingViewsService.views;
    // console.dir(this.theThingViewsService.views);
  }

  initResolveTheThing(): TheThing {
    if (this.theThing) {
      return this.theThing;
    }

    if (this.pageStashService.isMatchPageResolved(this.router.url)) {
      // Fetch the-thing from local temporary storage
      const pageData = this.pageStashService.pop();
      // console.log(pageData);
      const theThing = new TheThing().fromJSON(pageData.data.theThing);
      for (const key in pageData.promises) {
        if (pageData.promises.hasOwnProperty(key)) {
          const promise = pageData.promises[key];
          if (key === 'relation' && promise.data) {
            theThing.addRelations(promise.data.name, [promise.data.objectId]);
          }
        }
      }
      // console.log(theThing);
      return theThing;
    }

    // Fetch the-thing from route resolver
    const fromResolve = get(this.route.snapshot, 'data.theThing', null);
    if (fromResolve) {
      return fromResolve;
    }

    // Fetch the-thing from clone
    const cloneSource: TheThing = get(this.route.snapshot, 'data.clone', null);
    if (cloneSource) {
      return cloneSource.clone();
    }

    // // Fetch the-thing from clone origin
    // const cloneId = this.route.snapshot.queryParamMap.get('clone');
    // if (cloneId) {
    //   return this.theThingAccessService
    //     .get$(cloneId)
    //     .pipe(map(origin => origin.clone()));
    // }

    // Fetch the-thing from imitation template
    // console.log(this.route.snapshot.data);
    const fromImitationTemplate = get(
      this.route.snapshot,
      'data.imitationTemplate',
      null
    );
    if (fromImitationTemplate) {
      return fromImitationTemplate;
    }

    // Not found any source of the-thing, create a new one
    return new TheThing();
  }

  reset() {
    // Reset meta data
    this.formGroup.reset();
    // // Cear cell controls
    // for (const controlName in this.cellsFormGroup.controls) {
    //   if (this.cellsFormGroup.controls.hasOwnProperty(controlName)) {
    //     this.cellsFormGroup.removeControl(controlName);
    //   }
    // }
    // // Reset cell adder controls
    // this.formControlNewCellName.setValue(null);
    // this.formControlNewCellType.setValue(null);
    // this.formControlNewRelationName.setValue(null);

    if (this.theThing) {
      // Patch meta data
      console.log('reset');
      console.dir(this.theThing.cells);
      this.formGroup.patchValue(this.theThing);
      this.formControlCells.setValue(this.theThing.cells);
      // // Add cell controls for theThing
      // for (const name in this.theThing.cells) {
      //   if (this.theThing.cells.hasOwnProperty(name)) {
      //     const cell = this.theThing.cells[name];
      //     this.cellsFormGroup.addControl(
      //       cell.name,
      //       new FormControl(cell.value)
      //     );
      //   }
      // }
      // Relation controls
      this.fetchRelations();
    } else {
      this.formControlCells.setValue({});
    }
    this.pendingRelation = this.pageStashService.getPendingPromise('relation');
    this.inProgressing = false;
    // this.canDeleteAllCells = size(this.cellsFormGroup.controls) >= 3;
  }

  ngOnInit() {
    // if (!isArray(this.onlyCells)) {
    //   this.onlyCells = this.onlyCells !== undefined && this.onlyCells !== false;
    // }
    // console.dir(this.onlyCells);
    this.embed = this.embed !== undefined && this.embed !== false;
    // console.dir(this.theThing$);
    if (!this.theThing$) {
      this.theThing$ = new Subject();
    }
    this.subscriptions.push(
      this.theThing$.subscribe(theThing => {
        console.log('Update theThing');
        console.dir(theThing);
        this.theThing = theThing;
        this.reset();
      })
    );
    this.theThing$.next(this.initResolveTheThing());
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // addCell(cell: TheThingCell) {
  //   if (!cell) {
  //     const newCellName = this.formControlNewCellName.value;
  //     const newCellType = this.formControlNewCellType.value;
  //     cell = new TheThingCell().fromJSON({
  //       name: newCellName,
  //       type: newCellType,
  //       value: null
  //     });
  //   }
  //   if (this.theThing.hasCell(cell)) {
  //     alert(`資料欄位 ${cell.name} 已存在了喔`);
  //   } else {
  //     this.theThing.addCell(cell);
  //     this.cellsFormGroup.addControl(cell.name, new FormControl(cell.value));
  //     this.canDeleteAllCells = size(this.cellsFormGroup.controls) >= 3;
  //   }
  // }

  // deleteCell(cell: TheThingCell) {
  //   if (cell && confirm(`移除資料欄位 ${cell.name}`)) {
  //     this.theThing.deleteCell(cell);
  //     this.cellsFormGroup.removeControl(cell.name);
  //     this.canDeleteAllCells = size(this.cellsFormGroup.controls) >= 3;
  //   }
  // }

  // deleteAllCells() {
  //   if (confirm(`清除所有的資料欄位？`)) {
  //     for (const cellName in this.theThing.cells) {
  //       if (this.theThing.cells.hasOwnProperty(cellName)) {
  //         this.cellsFormGroup.removeControl(cellName);
  //       }
  //     }
  //     this.theThing.clearCells();
  //     this.canDeleteAllCells = size(this.cellsFormGroup.controls) >= 3;
  //   }
  // }

  openTheThingFinder() {
    const dialogRef = this.dialog.open(TheThingFinderComponent, {
      title: '從既有的物件中選取'
    });
    dialogRef.afterClosed().subscribe((theThings: TheThing[]) => {
      if (!isEmpty(theThings)) {
        this.theThing.addRelations(
          this.formControlNewRelationName.value,
          theThings
        );
        this.theThingChanged.emit(this.theThing);
        this.fetchRelations();
      }
    });
  }

  updateTheThing() {
    extend(this.theThing, this.formGroup.value);
    this.theThing.cells = this.formControlCells.value;
    if (this.currentUser && !this.theThing.ownerId) {
      this.theThing.ownerId = this.currentUser.id;
    }
  }

  fetchRelations() {
    if (this.theThing && !isEmpty(this.theThing.relations)) {
      this.relations = mapValues(this.theThing.relations, objectIds => {
        return { objects$: this.theThingAccessService.listByIds$(objectIds) };
      });
    } else {
      this.relations = {};
    }
  }

  gotoCreateRelationObject() {
    const relationName = this.formControlNewRelationName.value;
    this.updateTheThing();
    this.pageStashService.push({
      path: this.router.url,
      data: {
        id: this.theThing.id,
        theThing: this.theThing.toJSON()
      },
      promises: {
        relation: new PageStashPromise(relationName)
      }
    });
    if (this.router.url.match(/the-things\/create\/?/)) {
      console.log('Create new relation object');
      this.theThing$.next(new TheThing());
    } else {
      this.router.navigate(['/', 'the-things', 'create']);
    }
  }

  cancelPendingRelation() {
    if (confirm(`取消與前一物件的關聯：${this.pendingRelation.data} ?`)) {
      this.pageStashService.cancelPendingPromise('relation');
      this.pendingRelation = null;
    }
  }

  onDeleteRelation(relationName: string, objectThing: TheThing) {
    if (
      confirm(`確定要移除連結關係 ${relationName} - ${objectThing.name} ？`)
    ) {
      this.theThing.removeRelation(relationName, objectThing);
      this.theThingChanged.emit(this.theThing);
      this.fetchRelations();
    }
  }

  applyTemplate() {
    this.inProgressing = true;
    const dialogRef = this.dialog.open(ImageThumbnailListComponent, {
      title: '選取範本並套用',
      data: {
        items: this.imitations,
        singleSelect: true
      }
    });
    let selectedImitation: TheThingImitation;
    return dialogRef
      .afterClosed()
      .pipe(
        switchMap((imitation: TheThingImitation) => {
          // console.dir(imitation);
          if (!imitation) {
            return of(null);
          } else {
            selectedImitation = imitation;
            return this.theThingAccessService
              .get$(imitation.templateId)
              .pipe(take(1));
          }
        })
      )
      .subscribe(template => {
        if (
          selectedImitation &&
          template &&
          confirm(
            `套用範本 ${selectedImitation.name}，目前編輯資料將會遺失，確定繼續？`
          )
        ) {
          this.theThing.applyTemplate(template);
          this.theThing$.next(this.theThing);
        } else {
          this.inProgressing = false;
        }
      });
  }

  // isCellHidden(cellName: string) {
  //   if (isArray(this.onlyCells) && !isEmpty(this.onlyCells)) {
  //     // console.log(cellName);
  //     // console.log(this.onlyCells);
  //     return this.onlyCells.indexOf(cellName) < 0;
  //   } else {
  //     return true;
  //   }
  // }

  async onSubmit() {
    this.updateTheThing();
    // console.log(this.theThing);
    if (confirm(`新增/修改 ${this.theThing.name} ？`)) {
      try {
        this.theThing = await this.theThingAccessService.upsert(this.theThing);
        alert(`新增/修改 ${this.theThing.name} 成功`);
        this.router.navigate(['/', 'the-things', this.theThing.id]);
      } catch (error) {
        alert(`新增/修改失敗，錯誤訊息 ${error.message}`);
      }
    }
  }
}
