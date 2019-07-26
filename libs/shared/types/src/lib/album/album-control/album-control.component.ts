import { Component, OnInit } from '@angular/core';
import { Album } from '../album';

@Component({
  selector: 'ygg-album-control',
  templateUrl: './album-control.component.html',
  styleUrls: ['./album-control.component.css']
})
export class AlbumControlComponent implements OnInit {
  album: Album;

  constructor() { }

  ngOnInit() {
  }

  addImage() {

  }

  deleteImage(index: number) {

  }

  setCover(index: number) {
    
  }
}
