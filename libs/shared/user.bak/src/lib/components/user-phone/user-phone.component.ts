import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ygg-user-phone',
  templateUrl: './user-phone.component.html',
  styleUrls: ['./user-phone.component.css']
})
export class UserPhoneComponent implements OnInit {
  @Input() phone: string;
  
  constructor() { }

  ngOnInit() {
  }

}
