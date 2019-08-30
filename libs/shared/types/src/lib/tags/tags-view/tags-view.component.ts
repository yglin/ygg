import { Component, OnInit, Input } from '@angular/core';
import { Tags } from '../tags';

@Component({
  selector: 'ygg-tags-view',
  templateUrl: './tags-view.component.html',
  styleUrls: ['./tags-view.component.css']
})
export class TagsViewComponent implements OnInit {
  @Input() tags: Tags;
  
  constructor() { }

  ngOnInit() {
  }

}
