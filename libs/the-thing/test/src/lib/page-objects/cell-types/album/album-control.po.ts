import { Album } from "@ygg/shared/omni-types/core";
import { AlbumControlPageObject } from "@ygg/shared/omni-types/ui";
import { ImageUploaderPageObjectCypress } from "../../utils";

export class AlbumControlPageObjectCypress extends AlbumControlPageObject {
  selector: string;

  setValue(album: Album) {
    cy.get(this.getSelector('buttonClearAll')).click();
    cy.get(this.getSelector('addPhotots')).click();
    const imageUploader =  new ImageUploaderPageObjectCypress();
    imageUploader.expectOpen();
    imageUploader.addImagesByUrl(album.photos);
    imageUploader.submit();
    imageUploader.expectClose();
    // Click to set cover photo
    cy.get(this.getSelectorForPhoto(album.cover.src)).first().click();
  }
}

