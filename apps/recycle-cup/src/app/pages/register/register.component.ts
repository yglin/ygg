import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ImitationRecycleCup } from '@ygg/recycle-cup/core';
import { TheThing } from '@ygg/the-thing/core';
import { get } from 'lodash';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'ygg-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  ImitationRecycleCup = ImitationRecycleCup;
  cup$: Observable<TheThing>;
  formGroup: FormGroup;
  materials = ['PE', 'PP', '保麗龍'];

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      material: ['', Validators.required],
      capacity: [700, [Validators.required, Validators.min(100)]]
    });
  }

  ngOnInit(): void {}
}
