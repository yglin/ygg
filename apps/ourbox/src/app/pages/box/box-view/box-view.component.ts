import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { range } from 'lodash';

function forgeItems(): TheThing[] {
  return range(10).map(() => {
    const item = TheThing.forge();
    item.link = `items/${item.id}`;
    return item;
  });
}

@Component({
  selector: 'ygg-box-view',
  templateUrl: './box-view.component.html',
  styleUrls: ['./box-view.component.css']
})
export class BoxViewComponent implements OnInit {
  items$: Observable<TheThing[]>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.items$ = this.fetchItems();
  }

  fetchItems(): Observable<TheThing[]> {
    return of(forgeItems());
  }
}
