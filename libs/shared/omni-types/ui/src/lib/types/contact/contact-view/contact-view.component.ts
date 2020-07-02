import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Contact } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-contact-view',
  templateUrl: './contact-view.component.html',
  styleUrls: ['./contact-view.component.css']
})
export class ContactViewComponent implements OnInit {
  @Input() contact: Contact;

  constructor() {}

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('Contact View Changed~!!');
  //   console.dir(this.contact);
  // }

  ngOnInit() {}
}
