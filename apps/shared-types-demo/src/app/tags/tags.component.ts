import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Tags } from '@ygg/shared/omni-types/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ygg-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  formGroup: FormGroup;
  tags: Tags;
  autocompleteTags = new BehaviorSubject(new Tags(['APPLE', 'BANANA', 'GRAPE', 'CURRY', 'WATERMELON']));

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      tags: new Tags()
    });
    this.formGroup.get('tags').valueChanges.subscribe(value => {
      if (Tags.isTags(value)) {
        this.tags = value;
      }
    });
  }

  ngOnInit() {
  }


}
