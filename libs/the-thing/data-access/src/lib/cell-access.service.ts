import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TheThingCell } from "@ygg/the-thing/core";

@Injectable({
  providedIn: 'root'
})
export class CellAccessService {
  cells$: BehaviorSubject<TheThingCell[]> = new BehaviorSubject([]);
  
  constructor() { }
}
