import { Component, OnInit } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { ImitationBox } from '@ygg/ourbox/core';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BoxFactoryService } from '../box-factory.service';

@Component({
  selector: 'ourbox-my-boxes',
  templateUrl: './my-boxes.component.html',
  styleUrls: ['./my-boxes.component.css']
})
export class MyBoxesComponent implements OnInit {
  boxes$: Observable<TheThing[]>;
  ImitationBox = ImitationBox;

  constructor(private router: Router, private boxFactory: BoxFactoryService) {
    this.boxes$ = this.boxFactory.listMyBoxes$();
  }

  ngOnInit(): void {}

  createNew() {
    this.router.navigate(['/', 'ourbox', 'create-box']);
  }
}
