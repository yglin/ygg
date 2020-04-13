import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ygg-long-text-view',
  templateUrl: './long-text-view.component.html',
  styleUrls: ['./long-text-view.component.css']
})
export class LongTextViewComponent implements OnInit {
  @Input() longText: string;

  constructor() {}

  ngOnInit(): void {}
}
