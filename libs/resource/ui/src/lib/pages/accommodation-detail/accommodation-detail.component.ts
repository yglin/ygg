import { Component, OnInit, Input } from '@angular/core';
import { Accommodation } from '@ygg/resource/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ygg-accommodation-detail',
  templateUrl: './accommodation-detail.component.html',
  styleUrls: ['./accommodation-detail.component.css']
})
export class AccommodationDetailComponent implements OnInit {
  accommodation: Accommodation;

  constructor(private route: ActivatedRoute) {
    route.data.pipe(take(1)).subscribe(data => {
      if (data && data.accommodation) {
        this.accommodation = data.accommodation;
      }
    });
  }

  ngOnInit() {
  }

}
