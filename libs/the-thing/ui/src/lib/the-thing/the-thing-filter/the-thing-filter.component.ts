import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TheThingFilter } from '@ygg/the-thing/core';

@Component({
  selector: 'the-thing-filter',
  templateUrl: './the-thing-filter.component.html',
  styleUrls: ['./the-thing-filter.component.css']
})
export class TheThingFilterComponent implements OnInit, OnDestroy {
  @Output() filterChanged = new EventEmitter<TheThingFilter>();
  formGroup: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      tags: [],
      keywordName: ''
    });
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(value => {
        this.filterChanged.emit(new TheThingFilter(value));
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
