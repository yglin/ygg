import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Tags } from '../tags';

@Component({
  selector: 'ygg-tags-group-switch',
  templateUrl: './tags-group-switch.component.html',
  styleUrls: ['./tags-group-switch.component.css']
})
export class TagsGroupSwitchComponent implements OnInit {
  @Input() tagsLeft: string[];
  @Input() titleLeft: string = '';
  @Input() tagsRight: string[];
  @Input() titleRight: string = '';
  @Output() submit: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
