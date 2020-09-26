import { TheThingImitation } from '../imitation';

export abstract class ImitationFactory {
  imitations: { [id: string]: TheThingImitation } = {};

  registerImitation(imitation: TheThingImitation) {
    this.imitations[imitation.id] = imitation;
  }

  async get(imitationId: string): Promise<TheThingImitation> {
    if (imitationId in this.imitations) {
      return this.imitations[imitationId];
    } else {
      return Promise.reject(
        new Error(`Can not find Imitation ${imitationId}, did you register id?`)
      );
    }
  }
}
