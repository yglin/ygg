import { Post } from "./post";

export class Feedback extends Post {
  static forge(): Feedback {
    const forged = Post.forge();
    return forged;
  }
}