import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Treasure } from '@ygg/ourbox/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-treasure-create',
  templateUrl: './treasure-create.component.html',
  styleUrls: ['./treasure-create.component.css']
})
export class TreasureCreateComponent implements OnInit {
  treasure: Treasure;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.treasure = this.route.snapshot.data.treasure;
  }

}
