import { Post } from './post';

export class Feedback extends Post {
  static forge(): Feedback {
    const forged = Post.forge();
    forged.tags.add('feedback');
    return forged;
  }
}
