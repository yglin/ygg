import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@ygg/shared/post/core';
import { get } from 'lodash';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-post-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  post: Post;

  constructor(private route: ActivatedRoute) {
    this.post = get(this.route.snapshot.data, 'post', null);
    console.dir(this.post);
  }

  ngOnInit(): void {}
}
