import { find, isEmpty, extend, keyBy } from 'lodash';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TheThing, TheThingCell, TheThingCellTypes } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { Tags } from '@ygg/tags/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { TheThingFinderComponent } from '../the-thing-finder/the-thing-finder.component';
import { Subscription } from 'rxjs';
import {
  PageStashService,
  PageStashPromise
} from '@ygg/shared/infra/data-access';

@Component({
  selector: 'the-thing-the-thing-creator',
  templateUrl: './the-thing-creator.component.html',
  styleUrls: ['./the-thing-creator.component.css']
})
export class TheThingCreatorComponent implements OnInit {
  @Input() theThing: TheThing;
  formGroup: FormGroup;
  cellsFormGroup: FormGroup;
  formControlNewCellType: FormControl;
  cellTypes = TheThingCellTypes;
  formControlNewCellName: FormControl;
  cells: TheThingCell[] = [];
  formControlNewRelationName: FormControl;
  isNewRelationNameEmpty = true;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private theThingAccessService: TheThingAccessService,
    private router: Router,
    private dialog: YggDialogService,
    private pageStashService: PageStashService
  ) {
    this.formGroup = formBuilder.group({
      types: null,
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

  ngOnInit() {
    if (!this.theThing) {
      if (this.pageStashService.isMatchPageResolved(this.router.url)) {
        const pageData = this.pageStashService.pop();
        this.theThing = new TheThing().fromJSON(pageData.data.theThing);
        for (const key in pageData.promises) {
          if (pageData.promises.hasOwnProperty(key)) {
            const promise = pageData.promises[key];
            if (key === 'relation') {
              this.theThing.addRelations(promise.data.name, [
                promise.data.objectId
              ]);
            }
          }
        }
      }
    }
    if (!this.theThing) {
      this.theThing = new TheThing();
    }
    // console.log('PatchValue~!!!');
    // console.log(this.theThing);
    this.formGroup.patchValue(this.theThing);
    // console.log(this.formGroup.value);
    this.cells = [];
    for (const name in this.theThing.cells) {
      if (this.theThing.cells.hasOwnProperty(name)) {
        const cell = this.theThing.cells[name];
        this.addCell(cell);
      }
    }
    this.formControlNewCellName.setValue(null);
    this.formControlNewCellType.setValue(null);
    this.formControlNewRelationName.setValue(null);
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
    const nameAlreadyExists = !!find(
      this.cells,
      _cell => _cell.name === cell.name
    );
    if (nameAlreadyExists) {
      alert(`資料欄位 ${cell.name} 已存在了喔`);
    } else {
      this.cells.push(cell);
      this.cellsFormGroup.addControl(
        cell.name,
        new FormControl(cell.value)
      );
    }
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
    let types = this.formGroup.get('types').value;
    if (Tags.isTags(types)) {
      types = types.toIDArray();
    } else if(isEmpty(types)) {
      types = [];
    }
    
    const meta = {
      name: this.formGroup.get('name').value,
      types: types
    };
    extend(this.theThing, meta);
    this.theThing.cells = keyBy(this.cells, cell => cell.name);
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
    this.theThing = new TheThing();
    this.ngOnInit();
  }

  async onSubmit() {
    this.updateTheThing();
    if (confirm(`新增 ${this.theThing.name} ？`)) {
      try {
        this.theThing = await this.theThingAccessService.upsert(this.theThing);
        alert(`新增 ${this.theThing.name} 成功`);
        this.router.navigate(['/', 'the-things', this.theThing.id]);
      } catch (error) {
        alert(`新增失敗，錯誤訊息 ${error.message}`);
      }
    }
  }
}
