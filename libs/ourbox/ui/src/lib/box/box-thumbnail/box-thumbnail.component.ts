import { Component, Input, OnInit } from '@angular/core';
import { Box } from '@ygg/ourbox/core';
import { BoxFinderService } from '../box-finder.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-box-thumbnail',
  templateUrl: './box-thumbnail.component.html',
  styleUrls: ['./box-thumbnail.component.css']
})
export class BoxThumbnailComponent implements OnInit {
  @Input() id: string;
  box: Box;

  constructor(private boxFinder: BoxFinderService) {}

  ngOnInit(): void {
    if (this.id) {
      this.boxFinder.findById(this.id).then(box => (this.box = box));
    }
  }
}
