import { Component, OnInit, Input } from '@angular/core';
import { Tag } from './tags';

@Component({
  selector: 'ygg-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  @Input() tags: Tag[];

  constructor() { }

  ngOnInit() {
  }

}
