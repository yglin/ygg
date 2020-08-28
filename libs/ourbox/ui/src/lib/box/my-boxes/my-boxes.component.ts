import { Component, OnInit } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { ImitationBox } from '@ygg/ourbox/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BoxFactoryService } from '../box-factory.service';

@Component({
  selector: 'ourbox-my-boxes',
  templateUrl: './my-boxes.component.html',
  styleUrls: ['./my-boxes.component.css']
})
export class MyBoxesComponent implements OnInit {
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
    this.router.navigate(['/', 'ourbox', 'create-box']);
  }

}
