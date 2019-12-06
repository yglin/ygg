import { Component, OnInit } from '@angular/core';
import { Accommodation } from '@ygg/resource/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private router: Router) {
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

  onSaved(accommodation: Accommodation) {
    // console.log('Accommodation update/saved!!!');
    // console.log(accommodation);
    if (accommodation) {
      this.router.navigate(['/accommodations', accommodation.id]);
    }
  }
}
