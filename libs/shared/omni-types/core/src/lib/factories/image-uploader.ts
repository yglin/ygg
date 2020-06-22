import { Image } from '../types';

export abstract class ImageUploader {
  abstract async uploadImages(): Promise<Image[]>;
}
