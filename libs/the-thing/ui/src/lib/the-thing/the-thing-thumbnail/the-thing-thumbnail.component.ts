import { Component, OnInit, Input } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { Album } from '@ygg/shared/omni-types/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { take } from 'rxjs/operators';

@Component({
  selector: 'the-thing-thumbnail',
  templateUrl: './the-thing-thumbnail.component.html',
  styleUrls: ['./the-thing-thumbnail.component.css']
})
export class TheThingThumbnailComponent implements OnInit {
  @Input() theThing: TheThing;
  @Input() id: string;

  constructor(private theThingAccessServcie: TheThingAccessService) {}

  ngOnInit() {
    if (!this.theThing) {
      if (this.id) {
        this.theThingAccessServcie
          .get$(this.id)
          .pipe(take(1))
          .subscribe(theThing => (this.theThing = theThing));
      }
    }
  }
}
