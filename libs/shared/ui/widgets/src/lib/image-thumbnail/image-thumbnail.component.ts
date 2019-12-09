import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ygg-image-thumbnail',
  templateUrl: './image-thumbnail.component.html',
  styleUrls: ['./image-thumbnail.component.css']
})
export class ImageThumbnailComponent implements OnInit {
  @Input() image: string;
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
