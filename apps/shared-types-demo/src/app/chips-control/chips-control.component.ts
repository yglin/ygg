import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ygg-chips-control-demo',
  templateUrl: './chips-control.component.html',
  styleUrls: ['./chips-control.component.css']
})
export class ChipsControlDemoComponent implements OnInit {
  formGroup: FormGroup;
  label: string;
  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      chips: []
    });
  }

  ngOnInit() {
  }

}
