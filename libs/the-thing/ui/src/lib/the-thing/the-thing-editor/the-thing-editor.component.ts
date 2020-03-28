import {
  size,
  isEmpty,
  extend,
  get,
  mapValues,
  isArray,
  find,
  last,
  keys
} from 'lodash';
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
  TheThingView,
  RelationDef,
  ITheThingEditorComponent
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
  merge,
  from
} from 'rxjs';
import {
  map,
  switchMap,
  take,
  catchError,
  timeout,
  first,
  tap,
  filter
} from 'rxjs/operators';
import {
  PageStashService,
  PageStashPromise
} from '@ygg/shared/infra/data-access';
import { User, AuthenticateService } from '@ygg/shared/user';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { TheThingFinderComponent } from '../the-thing-finder/the-thing-finder.component';
import { TheThingViewsService } from '../../the-thing-views.service';
import { LogService } from '@ygg/shared/infra/log';
import { TheThingFactoryService } from '../../the-thing-factory.service';
import { Color } from 'chroma-js';
import * as chroma from 'chroma-js';

interface RelationCreation {
  relationName: string;
  subject: TheThing;
  imitation: TheThingImitation;
}

@Component({
  selector: 'the-thing-editor',
  templateUrl: './the-thing-editor.component.html',
  styleUrls: ['./the-thing-editor.component.css']
})
export class TheThingEditorComponent
  implements OnInit, ITheThingEditorComponent {
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
  imitation: TheThingImitation;
  imitations: TheThingImitation[] = [];
  hasImitations: boolean = false;
  pendingRelation: any;
  relations: {
    [relationName: string]: { objects$: Observable<TheThing[]> };
  } = {};
  inProgressing: boolean = false;
  // canDeleteAllCells: boolean = false;
  views: { [id: string]: TheThingView } = {};
  relationCreation: RelationCreation;
  relationCreationsStack: RelationCreation[] = [];
  formGroupRelations: FormGroup;
  relaitonEditorsPalette: Color[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private theThingFactory: TheThingFactoryService,
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
    this.formGroupRelations = formBuilder.group({});

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

    this.views = this.theThingViewsService.views;

    this.relaitonEditorsPalette = [chroma('#f8ffb8'), chroma('#ebb0ff')];
  }

  async initResolveTheThing(): Promise<TheThing> {
    if (this.theThing) {
      return this.theThing;
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

    let resolveNewThing: Promise<TheThing>;
    // Apply imitation
    const imitationId = this.route.snapshot.queryParamMap.get('imitation');
    if (imitationId) {
      resolveNewThing = new Promise((resolve, reject) => {
        this.imitationAccessService
          .get$(imitationId)
          .pipe(
            first(),
            map(imitation => {
              this.imitation = imitation;
              return imitation.createTheThing();
            }),
            catchError(error => {
              console.warn(error.message);
              return from(this.theThingFactory.create());
            })
          )
          .subscribe(newThing => {
            resolve(newThing);
          });
      });
    } else {
      resolveNewThing = this.theThingFactory.create();
    }
    return resolveNewThing;
  }

  reset() {
    for (const key in this.formGroupRelations.controls) {
      if (this.formGroupRelations.controls.hasOwnProperty(key)) {
        this.formGroupRelations.removeControl(key);
      }
    }
    if (this.theThing) {
      this.formGroup.patchValue(this.theThing, { emitEvent: false });
      this.formControlCells.setValue(this.theThing.cells, { emitEvent: false });
      for (const relationName in this.theThing.relations) {
        if (this.theThing.relations.hasOwnProperty(relationName)) {
          const relations = this.theThing.relations[relationName];
          // console.dir(JSON.stringify(relations));
          this.formGroupRelations.addControl(
            relationName,
            new FormControl(relations)
          );
        }
      }
    } else {
      this.formGroup.reset();
      this.formControlCells.setValue({}, { emitEvent: false });
    }
    this.relationCreation = last(this.relationCreationsStack);
    // this.pendingRelation = this.pageStashService.getPendingPromise('relation');
    this.inProgressing = false;
    // this.canDeleteAllCells = size(this.cellsFormGroup.controls) >= 3;
  }

  async ngOnInit() {
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
        // console.log('emit next theThing');
        // console.dir(theThing.toJSON());
        this.theThing = theThing;
        this.reset();
      })
    );
    const initTheThing = await this.initResolveTheThing();
    this.theThing$.next(initTheThing);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  updateTheThing() {
    extend(this.theThing, this.formGroup.value);
    this.theThing.cells = this.formControlCells.value;
    if (this.currentUser && !this.theThing.ownerId) {
      this.theThing.ownerId = this.currentUser.id;
    }
    this.theThing.relations = {};
    for (const relationName in this.formGroupRelations.controls) {
      if (this.formGroupRelations.controls.hasOwnProperty(relationName)) {
        const control = this.formGroupRelations.controls[relationName];
        this.theThing.relations[relationName] = control.value;
      }
    }
  }

  onAddNewRelation() {
    const relationName = this.formControlNewRelationName.value;
    // console.log(relationName);
    if (relationName in this.formGroupRelations.controls) {
      alert(`關聯 ${relationName} 已存在`);
    } else if (!!relationName) {
      this.formGroupRelations.addControl(relationName, new FormControl([]));
      // console.dir(keys(this.formGroupRelations.controls));
    }
  }

  gotoCreateRelationObject(relationName: string) {
    // const relationName = this.formControlNewRelationName.value;
    this.backupRelationCreation(relationName);
    // console.log('Create relation object');
    if (this.imitation) {
      this.imitationAccessService
        .getByRelation$(this.imitation, relationName)
        .pipe(
          take(1),
          filter(imitation => !!imitation),
          map(imitation => imitation.createTheThing()),
          timeout(5000),
          catchError(error => {
            console.warn(error);
            return from(this.theThingFactory.create());
          })
        )
        .subscribe(newThing => this.theThing$.next(newThing));
    } else {
      this.theThingFactory
        .create()
        .then(newThing => this.theThing$.next(newThing));
    }
  }

  backupRelationCreation(relationName: string) {
    this.updateTheThing();
    this.relationCreationsStack.push({
      relationName,
      subject: this.theThing,
      imitation: this.imitation
    });
    this.relationCreation = last(this.relationCreationsStack);
  }

  restoreRelationCreation() {
    // console.log('Restore relation subject!!');
    const relationCreation = this.relationCreationsStack.pop();
    const subject = relationCreation.subject;
    this.imitation = relationCreation.imitation;
    // console.dir(subject.toJSON());
    this.theThing$.next(subject);
    this.relationCreation = last(this.relationCreationsStack);
  }

  cancelCreateRelation() {
    if (this.relationCreation) {
      if (
        confirm(
          `取消關聯，回到前一物件 ${this.relationCreation.subject.name} 的編輯?`
        )
      ) {
        this.restoreRelationCreation();
      }
    }
  }

  // onDeleteRelation(relationName: string, objectThing: TheThing) {
  //   if (
  //     confirm(`確定要移除連結關係 ${relationName} - ${objectThing.name} ？`)
  //   ) {
  //     this.theThing.removeRelation(relationName, objectThing);
  //     this.theThingChanged.emit(this.theThing);
  //   }
  // }

  applyTemplate() {
    this.inProgressing = true;
    const dialogRef = this.dialog.open(ImageThumbnailListComponent, {
      title: '選取範本並套用',
      data: {
        items: this.imitations,
        singleSelect: true
      }
    });
    // let selectedImitation: TheThingImitation;
    return dialogRef.afterClosed().subscribe((imitation: TheThingImitation) => {
      if (
        imitation &&
        confirm(`套用範本 ${imitation.name} 將修改目前資料，確定繼續？`)
      ) {
        this.imitation = imitation;
        this.theThing.imitate(imitation.createTheThing());
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
        if (this.relationCreation) {
          this.relationCreation.subject.addRelations(
            this.relationCreation.relationName,
            [this.theThing]
          );
          this.restoreRelationCreation();
        } else {
          this.router.navigate(['/', 'the-things', this.theThing.id]);
        }
      } catch (error) {
        alert(`新增/修改失敗，錯誤訊息 ${error.message}`);
      }
    }
  }
}
