import { difference } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Resource, ResourceService } from '@ygg/shared/domain/resource';
import { MatSelectionListChange } from '@angular/material';
import { BehaviorSubject, merge, combineLatest } from 'rxjs';

@Component({
  selector: 'ygg-resource-selector',
  templateUrl: './resource-selector.component.html',
  styleUrls: ['./resource-selector.component.css']
})
export class ResourceSelectorComponent implements OnInit {
  @Input() selectedIds: Set<string>;
  @Input() multi: boolean;
  @Output() selectChange: EventEmitter<Set<string>>;
  displayResourceIds: string[];

  constructor(private resourceService: ResourceService) {
    this.selectChange = new EventEmitter<Set<string>>();
    combineLatest(this.resourceService.list$(), this.selectChange)
    .subscribe(([resources, selectedIdsSet]) => {
      const resourceIds = resources.map(r => r.id);
      const selectedIds = Array.from(selectedIdsSet as Set<string>);
      const unselectedIds = difference(resourceIds, selectedIds);
      this.displayResourceIds = [...selectedIds, ...unselectedIds];
    });
  }

  ngOnInit() {
    this.multi = (this.multi === undefined) ? false : true;
    if (!this.selectedIds) {
      this.selectedIds = new Set([]);
    }
    this.selectChange.emit(this.selectedIds);
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
    this.selectChange.emit(this.selectedIds);
  }
}
