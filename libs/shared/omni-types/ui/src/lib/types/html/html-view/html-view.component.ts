import { Component, OnInit, Input } from '@angular/core';
import { Html } from "@ygg/shared/omni-types/core";

@Component({
  selector: 'ygg-html-view',
  templateUrl: './html-view.component.html',
  styleUrls: ['./html-view.component.css']
})
export class HtmlViewComponent implements OnInit {
  @Input() html: Html;

  constructor() { }

  ngOnInit() {
  }

}
