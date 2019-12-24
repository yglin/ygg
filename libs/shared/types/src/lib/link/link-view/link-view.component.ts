import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ygg-link-view',
  templateUrl: './link-view.component.html',
  styleUrls: ['./link-view.component.css']
})
export class LinkViewComponent implements OnInit {
  @Input() link: string;
  
  constructor() { }

  ngOnInit() {
  }

}
