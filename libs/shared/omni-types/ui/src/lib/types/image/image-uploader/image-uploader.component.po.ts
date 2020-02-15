import { PageObject } from "@ygg/shared/test/page-object";

export class ImageUploaderPageObject extends PageObject {
  selectors = {
    main: '.image-uploader',
    inputImageUrl: '.url-input input',
    buttonAddImageUrl: '.url-input button',
    buttonSubmit: 'button#submit'
  }
}