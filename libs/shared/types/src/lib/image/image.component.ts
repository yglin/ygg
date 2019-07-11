import { Component, OnInit, Input } from '@angular/core';
import { Image, ImageType } from './image';

@Component({
  selector: 'ygg-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  @Input() image: Image;
  imageType = ImageType;

  constructor() { }

  ngOnInit() {
  }

}
