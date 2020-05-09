import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { interval } from 'rxjs';
import { tap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ygg-number-view',
  templateUrl: './number-view.component.html',
  styleUrls: ['./number-view.component.css']
})
export class NumberViewComponent implements OnInit, OnChanges {
  @Input() number: number;
  _number: number;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // this._number = 0;

    if (typeof this.number === 'number') {
      this._number = this.number;
      if (this.number > 0) {
        this._number = 0;
        const timeStep = 15;
        const timeLength = 300;
        const increment =
          ((this.number - this._number) * timeStep) / timeLength;
        interval(timeStep)
          .pipe(
            tap(() => {
              this._number = Math.min(
                Math.ceil(this._number + increment),
                this.number
              );
            }),
            takeWhile(() => this._number < this.number)
          )
          .subscribe();
      }
    } else {
      this._number = undefined;
    }
  }
}
