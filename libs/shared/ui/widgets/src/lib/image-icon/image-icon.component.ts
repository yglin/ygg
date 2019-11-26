import { Component, OnInit, Input } from '@angular/core';

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
  }

}
