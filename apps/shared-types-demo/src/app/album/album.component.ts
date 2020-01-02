import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Album } from '@ygg/shared/types';

@Component({
  selector: 'ygg-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  album: Album = Album.forge();
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      album: this.album
    });
    this.formGroup.get('album').valueChanges.subscribe(value => {
      // console.log('Album control changed~!!!');
      // console.log(value);
      if (Album.isAlbum(value)) {
        this.album = value.clone();
      }
    });
  }

  ngOnInit() {}
}
