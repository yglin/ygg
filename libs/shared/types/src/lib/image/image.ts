import { SerializableJSON } from "@ygg/shared/infra/data-access";

export enum ImageType {
  Unknown = 0,
  FontIcon,
  Asset,
  External
}

function isValidURL(value: string) {
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
}

export class Image implements SerializableJSON {
  static DEFAULT_IMAGE_SRC = '/assets/images/default-play-photo.png';

  private _src: string;
  type: ImageType;

  static isImage(value: any): value is Image {
    return !!(value && value.src);
  }

  static isValieImageExt(url: string): boolean{
    const urlTokens = url.split(".");
    const urlExt = urlTokens[urlTokens.length - 1].toUpperCase();
    if (urlExt === 'JPG' || urlExt === 'PNG' || urlExt === 'GIF') {
      return true;
    } else {
      return false;
    }
  }

  /** https://gist.github.com/bgrins/6194623 */
  static isDataUrl(url: string): boolean {
    const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
    return !!url.match(regex);
  }

  /** https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata/5100158 */
  static dataUrlToBlob(dataURI: string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString: string;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  get src(): string {
    return this._src;
  }
  set src(value: string) {
    if (value) {
      if (isValidURL(value)) {
        // A valid url, image source from external site
        this.type = ImageType.External;
      } else if (/^\/assets\//.test(value)){
        // A relative path, starts with /assets
        this.type = ImageType.Asset;
      } else if (!(/\/+/.test(value))) {
        // Contains no slash "/", could be font icon
        this.type = ImageType.FontIcon;
      } else {
        this.type = ImageType.Unknown;
      }
      this._src = value;
    }
  }

  get isDefault(): boolean {
    return this._src === Image.DEFAULT_IMAGE_SRC;
  }
  
  constructor(src?: string) {
    if (src) {
      this.src = src;
    } else {
      this.type = ImageType.Asset;
      this._src = Image.DEFAULT_IMAGE_SRC;
    }
  }

  isDataUrl(): boolean {
    return Image.isDataUrl(this.src);
  }

  getBlob(): Blob {
    if (Image.isDataUrl(this.src)) {
      return Image.dataUrlToBlob(this.src);
    } else {
      return null;
    }
  }

  fromJSON(data: any): this {
    if (data) {
      if (data.src) {
        this.src = data.src;
      }
    }
    return this;
  }

  toJSON(): any {
    return {
      src: this.src
    };
  }

}