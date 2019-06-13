import { Component, OnInit, Input } from '@angular/core';
import {Resource} from '../models';
import {ResourceService} from '../resource.service';

@Component({
  selector: 'ygg-resource-thumbnail',
  templateUrl: './resource-thumbnail.component.html',
  styleUrls: ['./resource-thumbnail.component.css']
})
export class ResourceThumbnailComponent implements OnInit {
  @Input() id: string;
  resource: Resource;

  constructor(
    private resourceService: ResourceService
  ) {}

  ngOnInit() {
    if (this.id) {
      this.resourceService.get$(this.id).subscribe(resource => this.resource = resource);
    }
  }

}
