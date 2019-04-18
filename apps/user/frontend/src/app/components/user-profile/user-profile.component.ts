import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { UserService } from '@ygg/shared/user';
// import { User } from '@ygg/shared/user';
import { AuthenticateService } from '@ygg/shared/user';

@Component({
  selector: 'ygg-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  id: string;

  constructor(
    private authenticateService: AuthenticateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authenticateService.currentUser$.subscribe(user => {
      if (user) {
        this.id = user.id;
      } else {
        this.id = undefined;
        this.router.navigate([''])
      }
    });
  }

}
