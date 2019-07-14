import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ygg-action-barred',
  templateUrl: './action-barred.component.html',
  styleUrls: ['./action-barred.component.css']
})
export class ActionBarredComponent implements OnInit {
  @Input() layout:string = 'col';

  constructor() { }

  ngOnInit() {
  }

}
