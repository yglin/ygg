import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '@ygg/shared/interfaces';

@Component({
  selector: 'ygg-contact-view',
  templateUrl: './contact-view.component.html',
  styleUrls: ['./contact-view.component.css']
})
export class ContactViewComponent implements OnInit {
  @Input() contact: string | Contact;

  constructor() { }

  ngOnInit() {
    if (this.contact) {
      if (typeof this.contact === 'string') {
        try {
          this.contact = JSON.parse(this.contact);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}
