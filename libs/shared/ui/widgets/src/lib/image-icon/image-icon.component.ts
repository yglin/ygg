import { Component, OnInit, Input } from '@angular/core';
import validator from 'validator';

@Component({
  selector: 'ygg-image-icon',
  templateUrl: './image-icon.component.html',
  styleUrls: ['./image-icon.component.css']
})
export class ImageIconComponent implements OnInit {
  @Input() src: string;
  @Input() icon: string;
  
  constructor() { }

  ngOnInit() {
    if (this.src && !validator.isURL(this.src)) {
      this.icon = this.src;
      this.src = undefined;
    }
  }

}
