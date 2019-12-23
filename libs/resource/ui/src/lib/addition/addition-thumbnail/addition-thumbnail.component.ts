import { Component, OnInit, Input } from '@angular/core';
import { Addition } from '@ygg/resource/core';

@Component({
  selector: 'ygg-addition-thumbnail',
  templateUrl: './addition-thumbnail.component.html',
  styleUrls: ['./addition-thumbnail.component.css']
})
export class AdditionThumbnailComponent implements OnInit {
  @Input() addition: Addition;
  iconSrc: string;

  constructor() { }

  ngOnInit() {
    this.iconSrc = this.addition && this.addition.album && this.addition.album.cover.src;
  }

}
