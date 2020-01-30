import { Component, OnInit } from '@angular/core';
import { ImageThumbnailItem } from "@ygg/shared/ui/widgets";
import { TheThingImitation } from '@ygg/the-thing/core';

@Component({
  selector: 'the-thing-the-thing-template-list',
  templateUrl: './the-thing-template-list.component.html',
  styleUrls: ['./the-thing-template-list.component.css']
})
export class TheThingTemplateListComponent implements OnInit {
  imitations: TheThingImitation[] = [];
  imageThumbItems: ImageThumbnailItem[] = [];

  constructor() { }

  ngOnInit() {
  }

}
