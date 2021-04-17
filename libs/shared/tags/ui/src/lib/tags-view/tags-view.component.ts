import { Component, Input, OnInit } from '@angular/core';
import { Tags } from '@ygg/shared/tags/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-tags-view',
  templateUrl: './tags-view.component.html',
  styleUrls: ['./tags-view.component.css']
})
export class TagsViewComponent implements OnInit {
  @Input() value: Tags;
  chips: string[] = [];

  constructor() {}

  ngOnInit() {
    // console.log('ygg-tags-view');
    if (Tags.isTags(this.value)) {
      // console.dir(this.value);
      this.chips = this.value.getTags();
    }
  }
}
