import { PageObject } from "@ygg/shared/infra/test-utils";

export class GeoPointViewComponentPageObject extends PageObject {
  selector = '.geo-point-view'
  selectors = {
    coordinates: '.coordinates'
  };
}

