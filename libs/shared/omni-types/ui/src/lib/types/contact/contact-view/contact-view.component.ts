import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Contact } from '@ygg/shared/omni-types/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-contact-view',
  templateUrl: './contact-view.component.html',
  styleUrls: ['./contact-view.component.css']
})
export class ContactViewComponent implements OnInit {
  @Input() contact: Contact;
  @Input() value: Contact;

  constructor() {}

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('Contact View Changed~!!');
  //   console.dir(this.contact);
  // }

  ngOnInit() {
    if (!this.contact) {
      this.contact = this.value;
    }
  }
}
