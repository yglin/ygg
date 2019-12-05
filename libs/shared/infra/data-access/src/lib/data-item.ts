import { Entity } from './entity';
import { SerializableJSON } from './serializable';

export interface DataItem extends Entity, SerializableJSON {
  refPath?: string;
}