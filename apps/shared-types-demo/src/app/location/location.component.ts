import { Component, OnInit } from '@angular/core';
import { Location } from '@ygg/shared/types';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ygg-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      location: new Location()
    });
  }

  ngOnInit() {
  }

}
