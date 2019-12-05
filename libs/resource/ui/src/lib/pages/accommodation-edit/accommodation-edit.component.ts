import { Component, OnInit } from '@angular/core';
import { Accommodation } from '@ygg/resource/core';
import { ActivatedRoute } from '@angular/router';
import { take, timeoutWith } from 'rxjs/operators';
import { resolve } from 'dns';
import { of } from 'rxjs';

@Component({
  selector: 'ygg-accommodation-edit',
  templateUrl: './accommodation-edit.component.html',
  styleUrls: ['./accommodation-edit.component.css']
})
export class AccommodationEditComponent implements OnInit {
  accommodation: Accommodation;

  constructor(private route: ActivatedRoute) {
    route.data
      .pipe(
        take(1),
        timeoutWith(1000, of({ accommodation: new Accommodation() }))
      )
      .subscribe(data => {
        if (data && data.accommodation) {
          this.accommodation = data.accommodation;
        } else {
          this.accommodation = new Accommodation();
        }
      });
  }

  ngOnInit() {}
}
