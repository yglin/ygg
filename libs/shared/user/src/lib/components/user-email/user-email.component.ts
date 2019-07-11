import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ygg-user-email',
  templateUrl: './user-email.component.html',
  styleUrls: ['./user-email.component.css']
})
export class UserEmailComponent implements OnInit {
  @Input() email: string;
  
  constructor() { }

  ngOnInit() {
  }

}
