import { Injectable } from '@angular/core';
import { OurboxHeadQuarter } from '@ygg/ourbox/core';

@Injectable({
  providedIn: 'root'
})
export class HeadQuarterService extends OurboxHeadQuarter {
  constructor() {
    super();
  }
}
