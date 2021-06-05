import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getEnv } from '@ygg/shared/infra/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isTesting = !!getEnv('test') ? true : false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  gotoDebugPage() {
    this.router.navigate(['/', 'debugging']);
  }
}
