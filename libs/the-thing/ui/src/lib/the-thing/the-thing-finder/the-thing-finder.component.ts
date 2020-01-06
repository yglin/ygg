import { isEmpty } from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { MatDialogRef } from '@angular/material/dialog';
import { combineLatest, Subscription } from 'rxjs';
import { debounceTime, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'the-thing-the-thing-finder',
  templateUrl: './the-thing-finder.component.html',
  styleUrls: ['./the-thing-finder.component.css']
})
export class TheThingFinderComponent implements OnInit, OnDestroy {
  filteredTheThings: TheThing[] = [];
  formControlTypesFilter: FormControl;
  formControlSearchName: FormControl;
  subscriptions: Subscription[] = [];
  selection: TheThing[];

  constructor(
    private theThingAccessService: TheThingAccessService,
    private dialogRef: MatDialogRef<TheThingFinderComponent>
  ) {
    this.formControlTypesFilter = new FormControl();
    this.formControlSearchName = new FormControl();
    this.subscriptions.push(
      combineLatest([
        this.formControlTypesFilter.valueChanges.pipe(
          startWith([]),
          switchMap(filterTypes => {
            if (isEmpty(filterTypes)) {
              return this.theThingAccessService.list$();
            } else {
              return this.theThingAccessService.findByTypes$(filterTypes);
            }
          })
        ),
        this.formControlSearchName.valueChanges.pipe(
          debounceTime(1000),
          startWith('')
        )
      ]).subscribe(([theThings, searchName]) => {
        // console.log(theThings);
        if (isEmpty(theThings)) {
          this.filteredTheThings = [];
        } else {
          if (!searchName) {
            this.filteredTheThings = theThings;
          } else {
            this.filteredTheThings = theThings.filter(thing =>
              thing.name.includes(searchName)
            );
          }
        }
        // console.log(this.filteredTheThings);
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onSelect(selected: TheThing[]) {
    this.selection = selected;
  }

  onSubmit() {
    this.dialogRef.close(this.selection);
  }
}
