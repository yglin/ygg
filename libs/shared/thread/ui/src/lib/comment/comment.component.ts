import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '@ygg/shared/thread/core';

@Component({
  selector: 'ygg-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() horizontalAlign: 'left' | 'right' = 'left';
  rowAlign: 'start' | 'end' = 'start';

  constructor() {}

  ngOnInit(): void {
    if (this.horizontalAlign === 'right') {
      this.rowAlign = 'end';
    }
  }
}
