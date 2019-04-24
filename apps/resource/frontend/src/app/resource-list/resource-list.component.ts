import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Resource} from '@ygg/shared/domain/resource';
import { ResourceService } from '@ygg/shared/domain/resource'

@Component({
  selector: 'ygg-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {
  @Input() selectIds: Set<string>;
  @Output() select: EventEmitter<Set<string>>;
  isSelectable: boolean;
  resources: Resource[];

  constructor(private resourceService: ResourceService) {
    this.select = new EventEmitter();
    this.isSelectable = false;
    this.resourceService.list$().subscribe(resources => {
      this.resources = resources;
      console.log(this.resources);
    });
  }

  ngOnInit() {
    this.isSelectable = this.select.observers.length > 0;
    if (!this.selectIds) {
      this.selectIds = new Set([]);
    }
  }

  isSelected(id: string): boolean {
    return this.isSelectable && this.selectIds.has(id);
  }

  onClick(id: string) {
    if (this.isSelectable) {
      if (this.selectIds.has(id)) {
        this.selectIds.delete(id);
      } else {
        this.selectIds.add(id);
      }
      this.select.emit(this.selectIds);
    }
  }
}
