import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '@ygg/shared/post/core';
import { get } from 'lodash';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-post-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  posts: Post[];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.posts = get(this.route.snapshot.data, 'posts', []);
    this.posts.sort((a, b) => (a.createAt > b.createAt ? -1 : 1));
    console.dir(this.posts);
  }

  ngOnInit(): void {}

  gotoPost(postId: string) {
    this.router.navigate([`../${postId}`], { relativeTo: this.route });
  }
}
