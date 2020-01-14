import { find, isEmpty, extend, get } from 'lodash';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TheThing, TheThingCell, TheThingCellTypes } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { Tags } from '@ygg/tags/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { TheThingFinderComponent } from '../the-thing-finder/the-thing-finder.component';
import { Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PageStashService,
  PageStashPromise
} from '@ygg/shared/infra/data-access';

@Component({
  selector: 'the-thing-the-thing-editor',
  templateUrl: './the-thing-editor.component.html',
  styleUrls: ['./the-thing-editor.component.css']
})
export class TheThingEditorComponent implements OnInit {
  @Input() theThing: TheThing;
  formGroup: FormGroup;
  cellsFormGroup: FormGroup;
  formControlNewCellType: FormControl;
  cellTypes = TheThingCellTypes;
  formControlNewCellName: FormControl;
  formControlNewRelationName: FormControl;
  isNewRelationNameEmpty = true;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private theThingAccessService: TheThingAccessService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: YggDialogService,
    private pageStashService: PageStashService
  ) {
    this.formGroup = formBuilder.group({
      tags: null,
      name: '東東'
    });
    this.cellsFormGroup = formBuilder.group({});
    this.formControlNewCellType = new FormControl();
    this.formControlNewCellName = new FormControl();
    this.formControlNewRelationName = new FormControl();
    this.subscriptions.push(
      this.formControlNewRelationName.valueChanges.subscribe(value => {
        this.isNewRelationNameEmpty = !value;
      })
    );
  }

  resolveTheThing$(): Observable<TheThing> {
    if (this.theThing) {
      return of(this.theThing);
    }

    if (this.pageStashService.isMatchPageResolved(this.router.url)) {
      // Fetch the-thing from local temporary storage
      const pageData = this.pageStashService.pop();
      // console.log(pageData);
      const theThing = new TheThing().fromJSON(pageData.data.theThing);
      for (const key in pageData.promises) {
        if (pageData.promises.hasOwnProperty(key)) {
          const promise = pageData.promises[key];
          if (key === 'relation') {
            theThing.addRelations(promise.data.name, [promise.data.objectId]);
          }
        }
      }
      // console.log(theThing);
      return of(theThing);
    }

    // Fetch the-thing from route resolver
    const fromResolver = get(this.route.snapshot, 'data.theThing', null);
    if (fromResolver) {
      return of(fromResolver);
    }

    // Fetch the-thing from clone origin
    const cloneId = this.route.snapshot.queryParamMap.get('clone');
    if (cloneId) {
      return this.theThingAccessService
        .get$(cloneId)
        .pipe(map(origin => origin.clone()));
    }

    // Not found any source of the-thing, create a new one
    return of(new TheThing());
  }

  reset() {
    this.formGroup.reset();
    this.formGroup.patchValue(this.theThing);

    for (const controlName in this.cellsFormGroup.controls) {
      if (this.cellsFormGroup.controls.hasOwnProperty(controlName)) {
        this.cellsFormGroup.removeControl(controlName);
      }
    }
    for (const name in this.theThing.cells) {
      if (this.theThing.cells.hasOwnProperty(name)) {
        const cell = this.theThing.cells[name];
        this.cellsFormGroup.addControl(cell.name, new FormControl(cell.value));
      }
    }
    this.formControlNewCellName.setValue(null);
    this.formControlNewCellType.setValue(null);
    this.formControlNewRelationName.setValue(null);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.resolveTheThing$().subscribe(theThing => {
        this.theThing = theThing;
        this.reset();
      })
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  addCell(cell: TheThingCell) {
    if (!cell) {
      const newCellName = this.formControlNewCellName.value;
      const newCellType = this.formControlNewCellType.value;
      cell = new TheThingCell().fromJSON({
        name: newCellName,
        type: newCellType,
        value: null
      });
    }
    if (this.theThing.hasCell(cell)) {
      alert(`資料欄位 ${cell.name} 已存在了喔`);
    } else {
      this.theThing.addCell(cell);
      this.cellsFormGroup.addControl(cell.name, new FormControl(cell.value));
    }
  }

  deleteCell(cell: TheThingCell) {
    if (cell && confirm(`移除資料欄位 ${cell.name}`)) {
      this.theThing.deleteCell(cell);
      this.cellsFormGroup.removeControl(cell.name);
    }
  }

  deleteAllCells() {
    for (const cellName in this.theThing.cells) {
      if (this.theThing.cells.hasOwnProperty(cellName)) {
        this.cellsFormGroup.removeControl(cellName);
      }
    }
    this.theThing.clearCells();
  }

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
      }
    });
  }

  updateTheThing() {
    extend(this.theThing, this.formGroup.value);
  }

  gotoCreateRelationObject() {
    this.updateTheThing();
    this.pageStashService.push({
      path: this.router.url,
      data: {
        id: this.theThing.id,
        theThing: this.theThing.toJSON()
      },
      promises: {
        relation: new PageStashPromise(this.formControlNewRelationName.value)
      }
    });
    if (this.router.url.match(/the-things\/create\/?/)) {
      this.theThing = new TheThing();
      this.ngOnInit();
    } else {
      this.router.navigate(['/', 'the-things', 'create']);
    }
  }

  onDeleteRelation(relationName: string, objectThing: TheThing) {
    if (
      confirm(`確定要移除連結關係 ${relationName} - ${objectThing.name} ？`)
    ) {
      this.theThing.removeRelation(relationName, objectThing);
    }
  }

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
