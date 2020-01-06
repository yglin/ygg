import { find, isEmpty, extend, keyBy } from 'lodash';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TheThing, TheThingCell, TheThingCellTypes } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { Tags } from '@ygg/tags/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { TheThingFinderComponent } from '../the-thing-finder/the-thing-finder.component';
import { Subscription } from 'rxjs';

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
    private dialog: YggDialogService
  ) {
    this.formGroup = formBuilder.group({
      types: [],
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
      this.theThing = new TheThing();
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  addCell() {
    const newCellName = this.formControlNewCellName.value;
    const newCellType = this.formControlNewCellType.value;
    const nameAlreadyExists = !!find(
      this.cells,
      _cell => _cell.name === newCellName
    );
    if (nameAlreadyExists) {
      alert(`資料欄位 ${newCellName} 已存在了喔`);
    } else {
      const cell = new TheThingCell().fromJSON({
        name: newCellName,
        type: newCellType,
        value: null
      });
      this.cells.push(cell);
      this.cellsFormGroup.addControl(
        this.formControlNewCellName.value,
        new FormControl()
      );
    }
  }

  openTheThingFinder() {
    const dialogRef = this.dialog.open(TheThingFinderComponent, {
      title: '從既有的物件中選取'
    });
    dialogRef.afterClosed().subscribe((theThings: TheThing[]) => {
      if (!isEmpty(theThings)) {
        this.theThing.addRelations(this.formControlNewRelationName.value, theThings);
      }
    });
  }

  async onSubmit() {
    const meta = {
      name: this.formGroup.get('name').value,
      types: (this.formGroup.get('types').value as Tags).toIDArray()
    };
    extend(this.theThing, meta);
    this.theThing.cells = keyBy(this.cells, cell => cell.name);
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
