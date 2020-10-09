import { keyBy, keys } from 'lodash';
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TheThingFilter } from '@ygg/the-thing/core';
import { TheThingFilterAccessService } from '@ygg/the-thing/data-access';
import { debounceTime } from 'rxjs/operators';
import { Tags } from '@ygg/tags/core';

@Component({
  selector: 'the-thing-filter',
  templateUrl: './the-thing-filter.component.html',
  styleUrls: ['./the-thing-filter.component.css']
})
export class TheThingFilterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filter: TheThingFilter;
  @Output() filterChanged = new EventEmitter<TheThingFilter>();
  formGroup: FormGroup;
  subscriptions: Subscription[] = [];
  formControlFilterName: FormControl = new FormControl('');
  enableSave = false;
  enableLoad = false;
  filters: { [name: string]: TheThingFilter } = {};
  autocompleteFilterNames: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private theThingFilterAccessService: TheThingFilterAccessService
  ) {
    this.filters = keyBy(this.theThingFilterAccessService.listLocal(), 'name');
    this.autocompleteFilterNames = keys(this.filters);
    this.formGroup = formBuilder.group({
      tags: [],
      keywordName: ''
    });
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(payload => {
        this.filterChanged.emit(
          new TheThingFilter().fromJSON({
            keywordName: payload.keywordName,
            tags: payload.tags ? (payload.tags as Tags).tags : []
          })
        );
      })
    );
    this.subscriptions.push(
      this.formControlFilterName.valueChanges
        .pipe(debounceTime(500))
        .subscribe(value => {
          if (!value) {
            this.enableSave = false;
            this.enableLoad = false;
            this.autocompleteFilterNames = keys(this.filters);
          } else {
            this.autocompleteFilterNames = keys(this.filters).filter(name =>
              name.toLowerCase().includes(value.toLowerCase())
            );
            if (value in this.filters) {
              this.enableSave = false;
              this.enableLoad = true;
            } else {
              this.enableSave = true;
              this.enableLoad = false;
            }
          }
        })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.filter) {
      this.formGroup.patchValue({
        tags: this.filter.tags,
        name: this.filter.keywordName
      });
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onSaveFilter() {
    const filterName = this.formControlFilterName.value;
    // console.log(filterName);
    if (filterName && confirm(`將目前的搜尋條件儲存為 ${filterName} ？`)) {
      const newFilter = new TheThingFilter(filterName, this.formGroup.value);
      try {
        this.theThingFilterAccessService.pushLocal(newFilter);
      } catch (error) {
        alert(`儲存失敗，錯誤： ${error.message}`);
      }
      alert(`儲存成功`);
    }
  }

  onLoadFilter() {
    const filterName = this.formControlFilterName.value;
    if (filterName && filterName in this.filters) {
      const loadFilter = this.filters[filterName];
      this.formGroup.patchValue(loadFilter);
    }
  }
}
