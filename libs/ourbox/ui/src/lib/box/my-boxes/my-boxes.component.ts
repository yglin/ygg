import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Box } from '@ygg/ourbox/core';
import { AuthenticateUiService } from '@ygg/shared/user/ui';
import { BoxFinderService } from '../box-finder.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-my-boxes',
  templateUrl: './my-boxes.component.html',
  styleUrls: ['./my-boxes.component.css']
})
export class MyBoxesComponent implements OnInit {
  boxes: Box[];

  constructor(
    private router: Router,
    private authenticator: AuthenticateUiService,
    private boxFinder: BoxFinderService
  ) {}

  ngOnInit(): void {
    this.loadMyBoxes();
  }

  async loadMyBoxes() {
    const currentUser = await this.authenticator.requestLogin();
    this.boxes = await this.boxFinder.findUserBoxes(currentUser);
  }

  createNew() {
    this.router.navigate(['/', 'ourbox', 'create-box']);
  }

  gotoBox(box: Box) {
    this.router.navigate(['/', 'box', box.id]);
  }
}
