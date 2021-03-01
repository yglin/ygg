import { Location } from '@ygg/shared/geography/core';

export abstract class GeographyAgent {
  abstract userInputLocation(): Promise<Location>;
}
