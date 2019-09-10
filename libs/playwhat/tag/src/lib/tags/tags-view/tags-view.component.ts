import { Component, OnInit, Input } from '@angular/core';
import { Tags } from '../tags';
import { isArray, isEmpty } from 'lodash';

@Component({
  selector: 'ygg-tags-view',
  templateUrl: './tags-view.component.html',
  styleUrls: ['./tags-view.component.css']
})
export class TagsViewComponent implements OnInit {
  @Input() tags: Tags | string[];
  tagNames: string[] = [];
  
  constructor() { }

  ngOnInit() {
//    console.log(this.tags);
    if (Tags.isTags(this.tags)) {
      this.tagNames = this.tags.getNames();
    } else if (isArray(this.tags) && !isEmpty(this.tags)) {
      this.tagNames = this.tags;
    }
//    console.log(this.tagNames);
  }

}
