import { PageObject } from "@ygg/shared/test/page-object";

export class LinkControlPageObject extends PageObject {
  selectors = {
    main: '.link-control',
    inputLink: 'input.link'
  }
}