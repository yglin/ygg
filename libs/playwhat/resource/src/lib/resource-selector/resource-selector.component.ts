import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import {Resource} from '../models';
import {ResourceService} from '../resource.service';
import {difference, filter} from 'lodash';
import {BehaviorSubject, combineLatest, merge} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

interface FilterOptions {
  keyword: string;
}

@Component({
  selector: 'ygg-resource-selector',
  templateUrl: './resource-selector.component.html',
  styleUrls: ['./resource-selector.component.css']
})
export class ResourceSelectorComponent implements OnInit {
  @Input() selectedIds: Set<string>;
  @Input() multi: boolean;
  @Output() selectChange: EventEmitter<string[]>;
  unselectedIds: string[];
  filterChange$: BehaviorSubject<FilterOptions>;

  constructor(private resourceService: ResourceService) {
    this.selectChange = new EventEmitter<string[]>();
    this.filterChange$ = new BehaviorSubject({keyword: ''});
    combineLatest(
        this.resourceService.list$(), this.selectChange,
        this.filterChange$.pipe(debounceTime(500)))
        .subscribe(([resources, selectedIdsSet, filterOptions]) => {
          // const resourceIds = resources.map(r => r.id);
          const selectedIds = Array.from(selectedIdsSet as Set<string>);
          const filteredResources = this.filter(resources, filterOptions);
          this.unselectedIds =
              difference(filteredResources.map(r => r.id), selectedIds);
        });
  }

  ngOnInit() {
    this.multi = (this.multi === undefined) ? false : true;
    if (!this.selectedIds) {
      this.selectedIds = new Set([]);
    }
    this.selectChange.emit(Array.from(this.selectedIds));
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  onSelect(selectionChange: MatSelectionListChange) {
    const targetId = selectionChange.option.value;
    if (this.selectedIds.has(targetId)) {
      this.selectedIds.delete(targetId);
    } else {
      if (!this.multi) {
        this.selectedIds.clear();
      }
      this.selectedIds.add(targetId);
    }
    this.selectChange.emit(Array.from(this.selectedIds));
  }

  filter(resources: Resource[], filterOptions: FilterOptions): Resource[] {
    let results = resources;

    if (!filterOptions) {
      return results;
    }

    if (filterOptions.keyword) {
      results = filter(resources, r => {
        return r.name && r.name.includes(filterOptions.keyword);
      });
    }

    return results;
  }

  onSearch(event: any) {
    const keyword = event.target.value;
    this.filterChange$.next({
      keyword
    });
  }
}
