import { Component, OnInit, Input } from '@angular/core';
import { AccountProviderService } from '../../account-provider.service';

@Component({
  selector: 'ygg-user-provider-link',
  templateUrl: './user-provider-link.component.html',
  styleUrls: ['./user-provider-link.component.css']
})
export class UserProviderLinkComponent implements OnInit {
  @Input() profile: any;
  providerIcon: string;
  
  constructor(
    private accountProviderService: AccountProviderService
  ) { }

  ngOnInit() {
    this.providerIcon = this.accountProviderService.getProviderIcon(this.profile);
  }

}
