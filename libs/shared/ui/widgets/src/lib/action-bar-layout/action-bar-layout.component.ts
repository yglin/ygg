import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ygg-action-bar-layout',
  templateUrl: './action-bar-layout.component.html',
  styleUrls: ['./action-bar-layout.component.css']
})
export class ActionBarLayoutComponent implements OnInit {
  @Input() position: string = 'top';
  layoutMain = 'column';
  layoutButtons = 'row';
  layoutAlignButtons = 'end center';
  actionBarStyle = {
    width: '50px',
    'max-height': '50px',
    overflow: 'visible',
    padding: '5px',
  };

  constructor() { }

  ngOnInit() {
    if (this.position === 'top') {
      this.layoutMain = 'column';
      this.layoutButtons = 'row';
      this.layoutAlignButtons = 'end start';
      this.actionBarStyle.width = '100%';
      this.actionBarStyle['max-height'] = '50px';
    } else if (this.position === 'right') {
      this.layoutMain = 'row-reverse';
      this.layoutButtons = 'column';
      this.layoutAlignButtons = 'start center';
      this.actionBarStyle.width = '50px';
      this.actionBarStyle['max-height'] = '100%';
    }
  }

}
