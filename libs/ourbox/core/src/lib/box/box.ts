import {
  Location,
  LocationRecord,
  LocationRecordAccessor
} from '@ygg/shared/geography/core';
import {
  DataAccessor,
  Emcee,
  generateID,
  HeadQuarter,
  toJSONDeep
} from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Album, Contact, Image } from '@ygg/shared/omni-types/core';
import { Authenticator, User } from '@ygg/shared/user/core';
import { extend, get, sample } from 'lodash';
import { Treasure } from '../treasure';

export class Box {
  [key: string]: any;

  static collection = 'boxes';
  static thumbnailSrc = '/assets/images/box/box-icon.png';
  static icon = 'inventory';

  id: string;
  name: string;
  ownerId: string;
  album: Album;
  location: Location;
  public: boolean;
  contact: Contact;
  treasures: Treasure[] = [];

  constructor(
    protected dataAccessor: DataAccessor,
    protected auth: Authenticator,
    protected headquarter: HeadQuarter,
    protected emcee: Emcee,
    protected locationRecordAccessor: LocationRecordAccessor,
    options: any = {}
  ) {
    this.id = generateID();
    this.public = false;
    extend(this, options);

    if (Album.isAlbum(options.album)) {
      this.album = new Album().fromJSON(options.album);
    }
    if (!this.album) {
      this.album = new Album(Box.thumbnailSrc);
    }

    if (Location.isLocation(options.location)) {
      this.location = new Location().fromJSON(options.location);
    }

    if (Contact.isContact(options.contact)) {
      this.contact = new Contact().fromJSON(options.contact);
    }
  }

  static isBox(value: any): value is Box {
    return value && value.name && value.album && value.location;
  }

  static forge(options: any = {}): Box {
    const forged = new Box(null, null, null, null, null);
    forged.name = `Troll Box ${Date.now()}`;
    forged.album = Album.forge({
      cover: new Image(Box.thumbnailSrc),
      photos: []
    });
    forged.location = Location.forge();
    forged.contact = Contact.forge();
    extend(forged, options);
    return forged;
  }

  get image(): string {
    return get(this.album, 'cover.src', null);
  }

  async save() {
    try {
      if (!this.ownerId) {
        const currentUser = await this.auth.requestLogin();
        this.ownerId = currentUser.id;
      }
      await this.dataAccessor.save(Box.collection, this.id, this.toJSON());
      if (Location.isLocation(this.location)) {
        const locationRecord = new LocationRecord({
          latitude: this.location.geoPoint.latitude,
          longitude: this.location.geoPoint.longitude,
          address: this.location.address,
          objectCollection: Box.collection,
          objectId: this.id
        });
        await this.locationRecordAccessor.save(locationRecord);
      }
      this.headquarter.emit('box.save.success', this);
    } catch (error) {
      const wrpErr = wrapError(error, `儲存寶箱 ${this.name} 失敗，錯誤原因：`);
      await this.emcee.error(wrpErr.message);
      this.headquarter.emit('box.save.fail', this);
      return Promise.reject(wrpErr);
    }
  }

  belongsTo(user: User) {
    return this.ownerId === user.id;
  }

  toJSON() {
    return toJSONDeep(this);
  }
}