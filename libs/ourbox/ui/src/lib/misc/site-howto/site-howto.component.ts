import { Component, OnInit } from '@angular/core';
import { CustomPages } from '@ygg/ourbox/core';

@Component({
  selector: 'ourbox-site-howto',
  templateUrl: './site-howto.component.html',
  styleUrls: ['./site-howto.component.css']
})
export class SiteHowtoComponent implements OnInit {
  customPageId = CustomPages['ourbox-custom-page-site-howto'].id;
  
  constructor() { }

  ngOnInit(): void {
  }

}
