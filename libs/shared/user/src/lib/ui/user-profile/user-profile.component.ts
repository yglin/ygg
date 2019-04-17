import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user.service';
import { User } from '../../models/user';
import { AuthenticateService } from '../../authenticate.service';

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
