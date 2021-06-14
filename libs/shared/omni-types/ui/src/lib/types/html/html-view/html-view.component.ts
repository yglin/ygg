import { Component, OnInit, Input } from '@angular/core';
import { Html } from '@ygg/shared/omni-types/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-html-view',
  templateUrl: './html-view.component.html',
  styleUrls: ['./html-view.component.css']
})
export class HtmlViewComponent implements OnInit {
  @Input() html: Html;
  @Input() value: Html;

  constructor() {}

  ngOnInit() {
    if (!this.value && this.html) {
      this.value = this.html;
    }
  }
}
