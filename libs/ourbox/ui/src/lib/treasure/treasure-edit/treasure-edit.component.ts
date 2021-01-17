import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Treasure } from '@ygg/ourbox/core';
import { get, isEmpty } from 'lodash';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-treasure-edit',
  templateUrl: './treasure-edit.component.html',
  styleUrls: ['./treasure-edit.component.css']
})
export class TreasureEditComponent implements OnInit {
  @Input() value: Treasure;
  hints: any = {};
  formGroupStep1: FormGroup;
  formGroupStep2: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroupStep1 = this.formBuilder.group({
      album: [null, Validators.required]
    });
    this.formGroupStep2 = this.formBuilder.group({
      name: ['', Validators.required],
      description: ''
    });
  }

  ngOnInit(): void {
    const album = get(this.value, 'album', null);
    if (!album || isEmpty(album.photos)) {
      this.hints.init = '請至少新增一張寶物的照片';
    } else {
      this.formGroupStep1.get('album').setValue(album);
    }
  }
}
