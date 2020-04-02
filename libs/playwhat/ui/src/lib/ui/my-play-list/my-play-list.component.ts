import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImitationPlay } from '@ygg/playwhat/core';
import { Router } from '@angular/router';
import { TheThing } from '@ygg/the-thing/core';
import { Observable, Subscription, of } from 'rxjs';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { AuthenticateService } from "@ygg/shared/user/ui";

@Component({
  selector: 'ygg-my-play-list',
  templateUrl: './my-play-list.component.html',
  styleUrls: ['./my-play-list.component.css']
})
export class MyPlayListComponent {
  ImitationPlay = ImitationPlay;
}
