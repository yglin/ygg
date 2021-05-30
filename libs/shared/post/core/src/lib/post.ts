import { extend } from "lodash";
import { generateID } from "@ygg/shared/infra/core";
import { Html } from "@ygg/shared/omni-types/core";

export class Post {
  id: string;
  content: Html;
  createAt: Date;
  authorId: string;

  static forge(): Post {
    const forged = new Post();
    forged.content = Html.forge();
    return forged;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options: any = {}) {
    this.id = generateID();
    this.createAt = new Date();
    extend(this, options);
  }
}
