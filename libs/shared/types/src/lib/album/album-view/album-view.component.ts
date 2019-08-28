import { Component, OnInit, Input } from '@angular/core';
import { Album } from '../album';

@Component({
  selector: 'ygg-album-view',
  templateUrl: './album-view.component.html',
  styleUrls: ['./album-view.component.css']
})
export class AlbumViewComponent implements OnInit {
  @Input() album: Album;

  constructor() {}

  ngOnInit() {}
}
