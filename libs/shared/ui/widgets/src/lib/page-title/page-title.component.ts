import { Component, Input } from '@angular/core';

@Component({
  selector: 'ygg-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.css']
})
export class PageTitleComponent {
  @Input() icon: string;

  constructor() { }
}
