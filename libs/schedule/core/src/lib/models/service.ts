import { Entity, hashStringToColor } from '@ygg/shared/infra/core';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import { Location, BusinessHours } from '@ygg/shared/omni-types/core';
import { generateID } from '@ygg/shared/infra/core';

export class Service implements Entity, ImageThumbnailItem {
  id: string;
  ownerId: string;
  name: string;
  image: string;
  timeLength: number;
  minParticipants: number;
  maxParticipants: number;
  location?: Location;
  businessHours?: BusinessHours;

  get color(): string {
    return hashStringToColor(this.name);
  }

  constructor() {
    this.id = generateID();
    this.minParticipants = 0;
  }
}
