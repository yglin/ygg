import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Tags } from '@ygg/tags/core';
import { isArray, isEmpty } from 'lodash';

@Component({
  selector: 'ygg-tags-view',
  templateUrl: './tags-view.component.html',
  styleUrls: ['./tags-view.component.css']
})
export class TagsViewComponent implements OnInit, OnChanges {
  @Input() tags: Tags | string[];
  tagNames: string[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('TagsViewComponent');
    // console.log(this.tags);
    if (Tags.isTags(this.tags)) {
      this.tagNames = this.tags.tags;
    } else if (isArray(this.tags) && !isEmpty(this.tags)) {
      this.tagNames = this.tags;
    }
  }

  ngOnInit() {}
}
