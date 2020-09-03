import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { sortBy } from 'lodash';
import { Comment } from '@ygg/shared/thread/core';
import { CommentFactoryService } from '../comment-factory.service';

@Component({
  selector: 'ygg-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit {
  @Input() subjectId: string;
  comments: Comment[] = [];
  formControlNewComment = new FormControl('', Validators.required);
  subscription: Subscription = new Subscription();

  constructor(protected commentFactory: CommentFactoryService) {}

  ngOnInit() {
    this.subscription.add(
      this.commentFactory
        .listBySubjectId$(this.subjectId)
        .subscribe(comments => {
          this.comments = sortBy(comments, ['createAt']).reverse();
        })
    );
  }

  async submitNewComment() {
    await this.commentFactory.addComment(
      this.subjectId,
      this.formControlNewComment.value
    );
    this.formControlNewComment.setValue('');
  }
}
