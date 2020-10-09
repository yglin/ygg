import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ContentChild
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';
import {
  TheThing,
  TheThingFilter,
  TheThingImitation
} from '@ygg/the-thing/core';
import { isEmpty, noop, get } from 'lodash';
// import { MatDialogRef } from '@angular/material/dialog';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subject,
  Subscription
} from 'rxjs';
import { TheThingAccessService } from '../../the-thing-access.service';
import { switchMap, map, tap } from 'rxjs/operators';
import { Directive } from '@angular/core';

@Directive({
  selector: '[theThingFinderItem]'
})
export class TheThingFinderItemDirective {}

@Component({
  selector: 'the-thing-finder',
  templateUrl: './the-thing-finder.component.html',
  styleUrls: ['./the-thing-finder.component.css']
})
export class TheThingFinderComponent
  implements OnInit, OnDestroy, YggDialogContentComponent {
  @Input() theThings$: Observable<TheThing[]>;
  @Input() imitation: TheThingImitation;
  @Input() filter: TheThingFilter;
  filter$: BehaviorSubject<TheThingFilter> = new BehaviorSubject(null);
  dialogData: { filter: TheThingFilter };
  dialogOutput$: Subject<TheThing[]> = new Subject();
  subscription: Subscription = new Subscription();
  theThings: TheThing[] = [];
  @Input() theThingItemTemplate: TemplateRef<any>;
  isEmptyTheThings = true;
  formControlTags = new FormControl();

  constructor(private theThingAccessService: TheThingAccessService) {}

  ngOnInit() {
    if (this.dialogData && this.dialogData.filter) {
      this.filter = this.dialogData.filter;
    }
    if (this.filter) {
      this.filter$.next(this.filter);
    }
    if (!this.theThings$) {
      const collection = get(this.imitation, 'collection', TheThing.collection);
      this.theThings$ = this.theThingAccessService.list$(collection);
    }
    this.subscription.add(
      combineLatest([this.theThings$, this.filter$])
        .pipe(
          map(([theThings, filter]) => {
            // console.log('TheThing Filter');
            // console.log(filter);
            // console.log('Before filter');
            // console.log(theThings);
            if (filter) {
              return theThings.filter(theThing => filter.test(theThing));
            } else {
              return theThings;
            }
          }),
          tap(theThings => {
            // console.log('After filter');
            // console.log(theThings);
            this.theThings = theThings;
            this.isEmptyTheThings = isEmpty(this.theThings);
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFilterChanged(filter: TheThingFilter) {
    this.filter$.next(filter);
  }
}
