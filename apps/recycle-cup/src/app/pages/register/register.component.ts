import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImitationRecycleCup } from '@ygg/recycle-cup/core';
import { TheThing } from '@ygg/the-thing/core';
import { get } from 'lodash';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'ygg-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  ImitationRecycleCup = ImitationRecycleCup;
  cup$: Observable<TheThing>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.cup$ = of(get(this.route.snapshot.data, 'cup'));
  }
}
