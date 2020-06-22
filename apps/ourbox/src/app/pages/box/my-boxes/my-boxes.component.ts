import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TheThing } from '@ygg/the-thing/core';
import { ImitationBox } from '@ygg/ourbox/core';
import { BoxFactoryService } from '../../../box-factory.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-my-boxes',
  templateUrl: './my-boxes.component.html',
  styleUrls: ['./my-boxes.component.css']
})
export class MyBoxesComponent implements OnInit, OnDestroy {
  boxes: TheThing[] = [];
  ImitationBox = ImitationBox;
  subscriptions: Subscription[] = [];

  constructor(private router: Router, private boxFactory: BoxFactoryService) {
    this.subscriptions.push(
      this.boxFactory.listMyBoxes$().subscribe(boxes => (this.boxes = boxes))
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngOnInit(): void {}

  createNew() {
    this.router.navigate(['/', 'ourbox', 'create']);
  }
}
