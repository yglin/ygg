import { Injectable } from '@angular/core';
import { ImitationFactory } from '@ygg/the-thing/core';

@Injectable({
  providedIn: 'root'
})
export class ImitationFactoryService extends ImitationFactory {

  constructor() {
    super();
  }
}
