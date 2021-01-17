import { noop, isEmpty } from 'lodash';
import { Component, forwardRef, Input } from '@angular/core';
import { Album } from '@ygg/shared/omni-types/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-album-control',
  templateUrl: './album-control.component.html',
  styleUrls: ['./album-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AlbumControlComponent),
      multi: true
    }
  ]
})
export class AlbumControlComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() hints: any = {};
  _album: Album = new Album();
  set album(value: Album) {
    if (value) {
      this._album = value;
      if (this.emitChange) {
        this.emitChange(this._album);
      }
    }
  }
  get album(): Album {
    return this._album;
  }

  emitChange: (value: Album) => any = noop;

  constructor() {}

  writeValue(value: Album) {
    if (value) {
      this._album = value;
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) {}

  onAlbumChanged(album: Album) {
    // console.log('album changed from AlbumComponent!!!');
    if (Album.isAlbum(album)) {
      this.album = album;
    }
  }
}
