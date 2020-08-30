import { Image } from '../types';

export abstract class ImageUploader {
  abstract async uploadImages(options: { multi?: boolean }): Promise<Image[]>;
}
