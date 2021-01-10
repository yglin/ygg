import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TreasureFactory } from '@ygg/ourbox/core';

@Injectable({
  providedIn: 'root'
})
export class TreasureFactoryService extends TreasureFactory {
  constructor(router: Router) {
    super(router);
  }
}
