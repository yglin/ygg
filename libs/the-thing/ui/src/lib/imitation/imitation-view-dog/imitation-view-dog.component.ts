import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  TheThing,
  TheThingValidateError,
  ImitationDog
} from '@ygg/the-thing/core';
import { TheThingImitationViewInterface } from '../../the-thing';

@Component({
  selector: 'the-thing-imitation-view-dog',
  templateUrl: './imitation-view-dog.component.html',
  styleUrls: ['./imitation-view-dog.component.css']
})
export class ImitationViewDogComponent
  implements OnInit, TheThingImitationViewInterface {
  @Input() theThing: TheThing;
  validateErrors: TheThingValidateError[] = [];

  constructor() {}

  ngOnInit() {
    if (this.theThing) {
      this.validateErrors = ImitationDog.validate(this.theThing);
    }
  }
}
