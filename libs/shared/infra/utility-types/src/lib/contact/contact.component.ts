import { Component, OnInit, Input } from '@angular/core';
import { Contact } from './contact';

@Component({
  selector: 'ygg-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @Input() contact: Contact;
  
  constructor() { }

  ngOnInit() {
  }

}
