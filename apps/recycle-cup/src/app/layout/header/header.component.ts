import { Component, OnInit } from '@angular/core';
import { SideDrawerService } from '@ygg/shared/ui/navigation';

@Component({
  selector: 'recycle-cup-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private sideDrawer: SideDrawerService) { }

  ngOnInit() {
  }

  openSideDrawer() {
    this.sideDrawer.open();
  }

}
