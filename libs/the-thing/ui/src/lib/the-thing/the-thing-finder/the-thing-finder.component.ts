import { isEmpty } from 'lodash';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
// import { MatDialogRef } from '@angular/material/dialog';
import {
  of,
  combineLatest,
  Subscription,
  BehaviorSubject,
  Observable
} from 'rxjs';
import { debounceTime, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'the-thing-finder',
  templateUrl: './the-thing-finder.component.html',
  styleUrls: ['./the-thing-finder.component.css']
})
export class TheThingFinderComponent implements OnInit, OnDestroy {
  @Input() theThings: TheThing[];
  @Input() theThings$: Observable<TheThing[]>;
  @Output() selectChange = new EventEmitter<TheThing[]>();
  filter$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(null);
  filteredTheThings: TheThing[] = [];
  formControlTypesFilter: FormControl;
  formControlSearchName: FormControl;
  subscriptions: Subscription[] = [];
  selection: TheThing[];
  isDialog = false;

  constructor(private theThingAccessService: TheThingAccessService) {
    // this.subscriptions.push(
    //   combineLatest([
    //     this.formControlTypesFilter.valueChanges.pipe(
    //       startWith([]),
    //       switchMap(filterTypes => {
    //         if (isEmpty(filterTypes)) {
    //           return this.theThingAccessService.list$();
    //         } else {
    //           return this.theThingAccessService.findByTags$(filterTypes);
    //         }
    //       })
    //     ),
    //     this.formControlSearchName.valueChanges.pipe(
    //       debounceTime(1000),
    //       startWith('')
    //     )
    //   ]).subscribe(([theThings, searchName]) => {
    //     // console.log(theThings);
    //     if (isEmpty(theThings)) {
    //       this.filteredTheThings = [];
    //     } else {
    //       if (!searchName) {
    //         this.filteredTheThings = theThings;
    //       } else {
    //         this.filteredTheThings = theThings.filter(thing =>
    //           thing.name.includes(searchName)
    //         );
    //       }
    //     }
    //     // console.log(this.filteredTheThings);
    //   })
    // );
  }

  ngOnInit() {
    if (!this.theThings$) {
      if (this.theThings) {
        this.theThings$ = of(this.theThings);
      } else {
        this.theThings$ = this.theThingAccessService.list$();
      }
    }
    this.subscriptions.push(
      combineLatest([this.theThings$, this.filter$]).subscribe(
        ([theThings, filter]) => {
          if (filter) {
            this.filteredTheThings = (filter as TheThingFilter).filter(
              theThings
            );
          } else {
            this.filteredTheThings = theThings;
          }
        }
      )
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onFilterChanged(filter: TheThingFilter) {
    this.filter$.next(filter);
  }

  onSelect(selected: TheThing[]) {
    this.selectChange.emit(selected);
  }

}
