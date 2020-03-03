import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GeoPoint } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-geo-point',
  templateUrl: './geo-point.component.html',
  styleUrls: ['./geo-point.component.css']
})
export class GeoPointComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      geoPoint: new GeoPoint()
    });
  }

  ngOnInit() {
  }

}
