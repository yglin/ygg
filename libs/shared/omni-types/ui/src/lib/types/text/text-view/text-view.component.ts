import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ygg-text-view',
  templateUrl: './text-view.component.html',
  styleUrls: ['./text-view.component.css']
})
export class TextViewComponent implements OnInit {
  @Input() text: string;

  constructor() {}

  ngOnInit(): void {}
}
