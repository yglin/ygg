import { EntityAccessor, toJSONDeep } from '@ygg/shared/infra/core';
import { Comment } from '../models';
import { Html } from '@ygg/shared/omni-types/core';

export class CommentAccessor extends EntityAccessor<Comment> {
  collection = Comment.collection;

  serializer = (comment: Comment): any => {
    return toJSONDeep(comment);
  };

  deserializer = (data: any): Comment => {
    const comment = new Comment(data);
    comment.createAt = new Date(data.createAt);
    // console.log(data.content);
    comment.content = new Html(data.content);
    // console.log(comment.content);
    return comment;
  };
}
