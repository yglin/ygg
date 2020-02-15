import { Component, OnInit, Input } from '@angular/core';
import validator from 'validator';

@Component({
  selector: 'ygg-image-icon',
  templateUrl: './image-icon.component.html',
  styleUrls: ['./image-icon.component.css']
})
export class ImageIconComponent implements OnInit {
  @Input() src: string;
  isSrcUrl: boolean;

  constructor() {}

  ngOnInit() {
    // console.dir(this.src);
    if (!this.src) {
      this.src = '/assets/images/no-image.jpg';
    }
    if (
      validator.isURL(this.src, {
        require_protocol: false,
        require_host: false
      })
    ) {
      this.isSrcUrl = true;
    } else {
      this.isSrcUrl = false;
    }
  }
}
