import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ygg-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  selectedTabIndex = 0;

  constructor(private route: ActivatedRoute) {
    if (this.route.snapshot.queryParamMap.get('view') === 'calendar') {
      this.selectedTabIndex = 1;
    }
  }

  ngOnInit(): void {
  }

}
